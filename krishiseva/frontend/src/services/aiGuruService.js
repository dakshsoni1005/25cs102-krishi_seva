import api from "./api";

export const aiGuruService = {
  getChatHistory: async () => {
    const response = await api.get("/ai-guru/conversations");
    return response.data.data.conversations;
  },

  sendMessage: async (messageText, history = []) => {
    if (!messageText || messageText.trim() === "") {
      throw new Error("Message cannot be empty.");
    }

    // Identify if there is an active conversation session to continue the thread
    const cachedConvoId = localStorage.getItem("krishiseva_active_convo_id") || null;

    const response = await api.post("/ai-guru/chat", {
      message: messageText,
      conversationId: cachedConvoId
    });

    const { conversationId, messages } = response.data.data;
    
    // Store conversationId to continue thread
    localStorage.setItem("krishiseva_active_convo_id", conversationId);

    // Return the latest AI response message block
    const latestAiMessage = messages[messages.length - 1];

    return {
      sender: "ai",
      text: latestAiMessage.text,
      timestamp: latestAiMessage.timestamp
    };
  }
};

export default aiGuruService;
