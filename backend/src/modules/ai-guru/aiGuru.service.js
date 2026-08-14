const AIConversation = require("../../database/models/AIConversation");
const AIMessage = require("../../database/models/AIMessage");
const FarmerProfile = require("../../database/models/FarmerProfile");
const SoilProfile = require("../../database/models/SoilProfile");
const CropCycle = require("../../database/models/CropCycle");
const geminiClient = require("../../integrations/gemini/gemini.client");

const getConversationsList = async (farmerId) => {
  const list = await AIConversation.find({ farmerId }).sort({ lastMessageAt: -1 }).lean();
  return list.map((c) => ({
    id: c._id.toString(),
    title: c.title,
    date: c.lastMessageAt ? c.lastMessageAt.toISOString().split("T")[0] : c.updatedAt.toISOString().split("T")[0]
  }));
};

const getConversationDetails = async (farmerId, conversationId) => {
  const convo = await AIConversation.findOne({ _id: conversationId, farmerId });
  if (!convo) {
    const err = new Error("Conversation not found.");
    err.statusCode = 404;
    throw err;
  }

  // Retrieve all referenced messages sorted by creation date
  const messages = await AIMessage.find({ conversationId }).sort({ createdAt: 1 }).lean();

  return {
    _id: convo._id,
    farmerId: convo.farmerId,
    title: convo.title,
    language: convo.language,
    context: convo.context,
    messages: messages.map((m) => ({
      sender: m.role === "assistant" ? "ai" : m.role, // Convert assistant to ai for frontend compatibility
      text: m.content,
      timestamp: m.createdAt
    }))
  };
};

const handleChat = async (farmerId, messageText, conversationId = null) => {
  // 1. Compile farmer context for Gemini AI system prompt
  const profile = await FarmerProfile.findOne({ userId: farmerId });
  const soil = await SoilProfile.findOne({ farmerId });
  const crops = await CropCycle.find({ farmerId, status: "active" });

  let contextString = `You are Krishi AI Guru, a senior agronomy expert advising Indian farmers. Translate responses to the user's selected language. Current language: ${profile?.language || "en"}.`;
  
  if (profile) {
    contextString += `
Farmer Context:
- Name: ${profile.fullName}
- Registered Location: Village: ${profile.village}, Taluka: ${profile.taluka}, District: ${profile.district}, State: ${profile.state}
- Farm Size: ${profile.farmSize} Acres
- Irrigation Type: ${profile.irrigationType}
- Main crop: ${profile.mainCrop}`;
  }

  if (soil) {
    contextString += `
Soil Profile:
- Soil type: ${soil.soilType}
- Soil pH: ${soil.ph}
- Soil Health Score: ${soil.healthScore}/100
- Nutrients Status: Nitrogen: ${soil.nitrogen} kg/ha, Phosphorus: ${soil.phosphorus} kg/ha, Potassium: ${soil.potassium} kg/ha`;
  }

  if (crops && crops.length > 0) {
    contextString += `
Active Crops blocks:
` + crops.map((c) => `- Crop: ${c.cropName}, Variety: ${c.variety}, Growth Stage: ${c.currentGrowthStage}, Health: ${c.healthStatus}`).join("\n");
  }

  contextString += `\nKeep your responses concise, action-oriented, professional, and tailored specifically to this farmer's context. Do not use cartoonish layout formats.`;

  // 2. Generate AI Reply via Gemini adapter
  const aiReplyText = await geminiClient.generateChatResponse(messageText, contextString);

  // 3. Save to database (append or create new conversation)
  let conversation;

  if (conversationId) {
    conversation = await AIConversation.findOne({ _id: conversationId, farmerId });
    if (!conversation) {
      const err = new Error("Active conversation thread not found.");
      err.statusCode = 404;
      throw err;
    }
  } else {
    // Generate simple title from user prompt (first 4 words)
    const title = messageText.split(" ").slice(0, 4).join(" ") + (messageText.split(" ").length > 4 ? "..." : "");
    conversation = await AIConversation.create({
      farmerId,
      title,
      language: profile?.language || "en",
      context: contextString,
      lastMessageAt: new Date()
    });
  }

  // 4. Save separate user and assistant messages
  await AIMessage.create([
    {
      conversationId: conversation._id,
      farmerId,
      role: "user",
      content: messageText
    },
    {
      conversationId: conversation._id,
      farmerId,
      role: "assistant",
      content: aiReplyText
    }
  ]);

  // Update conversation lastMessageAt timestamp
  conversation.lastMessageAt = new Date();
  await conversation.save();

  // 5. Query and format all messages for frontend re-sync
  const messagesList = await AIMessage.find({ conversationId: conversation._id }).sort({ createdAt: 1 }).lean();

  return {
    conversationId: conversation._id.toString(),
    title: conversation.title,
    messages: messagesList.map((m) => ({
      sender: m.role === "assistant" ? "ai" : m.role,
      text: m.content,
      timestamp: m.createdAt
    }))
  };
};

const deleteConversation = async (farmerId, conversationId) => {
  // Find conversation
  const convo = await AIConversation.findOne({ _id: conversationId, farmerId });
  if (!convo) {
    const err = new Error("Conversation not found or unauthorized.");
    err.statusCode = 404;
    throw err;
  }

  // Delete all referenced messages in this thread
  await AIMessage.deleteMany({ conversationId });
  
  // Delete the conversation header
  await AIConversation.findByIdAndDelete(conversationId);
  return convo;
};

module.exports = {
  getConversationsList,
  getConversationDetails,
  handleChat,
  deleteConversation
};
