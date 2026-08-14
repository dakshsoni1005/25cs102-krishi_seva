import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Button, Card, PageHeader, Toast } from "../components/common";
import { MessageSquare, Send, Trash2, Cpu, Sparkles, MessageCircle } from "lucide-react";
import { aiGuruService } from "../services/aiGuruService";

export const AIGuru = () => {
  const { t } = useApp();

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Namaste! I am your Krishi AI Guru, ready to help you with soil management, pest treatments, sowing timelines, and government schemes.\n\nAsk me anything, or tap one of the suggested questions below!",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState(null);

  const chatEndRef = useRef(null);

  const suggestedQuestions = [
    "What fertilizer should I use for cotton?",
    "Will it rain tomorrow in my district?",
    "Why are my leaves turning yellow?",
    "Which crop should I grow this season?",
    "Show APMC market prices for groundnut.",
    "Which government schemes am I eligible for?"
  ];

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const hist = await aiGuruService.getChatHistory();
        setHistory(Array.isArray(hist) ? hist : []);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    };
    loadHistory();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    if (!textToSend || textToSend.trim() === "") return;

    const userMsg = {
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const aiReply = await aiGuruService.sendMessage(textToSend, messages);
      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      const errorText = error.response?.data?.message || "AI service is currently unavailable. Please verify your backend configuration or try again later.";
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `⚠️ ${errorText}`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage(inputText);
  };

  const clearChat = () => {
    setMessages([
      {
        sender: "ai",
        text: "Conversation cleared. Ask me a new question about your field crop blocks!",
        timestamp: new Date().toISOString()
      }
    ]);
    setToast({ type: "success", message: "Chat conversation cleared." });
  };

  return (
    <div className="space-y-6 select-none h-[calc(100vh-12rem)] md:h-[calc(100vh-10rem)] flex flex-col">
      
      <PageHeader
        title={t("aiGuru")}
        subtitle="Conversational assistant. Ask agronomy questions, analyze soil pH values, check APMC rates, or verify scheme qualifications."
        className="mb-2"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 items-stretch">
        
        {/* 1. CHAT HISTORY SIDEBAR */}
        <Card className="hidden lg:flex flex-col gap-4 bg-white border border-border-soft p-4 h-full">
          <div className="flex items-center justify-between border-b border-border-soft pb-3 shrink-0">
            <h4 className="font-extrabold text-sm text-text-dark flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-primary-800" />
              Chat Conversations
            </h4>
            <button
              onClick={clearChat}
              className="text-text-muted hover:text-red-600 p-1 rounded-md hover:bg-red-50 cursor-pointer"
              title="Clear Active Chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs">
            {history.map((hist) => (
              <button
                key={hist.id || hist._id}
                onClick={() => handleSendMessage(hist.title)}
                className="w-full text-left p-2.5 rounded-lg border border-border-soft/60 hover:bg-surface-soft text-text-muted hover:text-text-dark font-semibold transition-colors cursor-pointer truncate block"
              >
                {hist.title}
                <div className="text-[9px] text-text-muted mt-0.5 font-normal">{hist.date}</div>
              </button>
            ))}
          </div>

          <div className="border-t border-border-soft pt-3 text-[10px] font-semibold text-text-muted shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary-800" />
            Gemini LLM model endpoint
          </div>
        </Card>

        {/* 2. MAIN CHAT AREA */}
        <Card className="lg:col-span-3 flex flex-col bg-white border border-border-soft p-4 h-full overflow-hidden">
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin">
            {messages.map((msg, idx) => {
              const isAi = msg.sender === "ai";
              return (
                <div
                  key={idx}
                  className={`flex gap-3 max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                    isAi
                      ? "bg-primary-900 border-primary-850 text-accent-300"
                      : "bg-primary-100 border-primary-200 text-primary-800"
                  }`}>
                    {isAi ? <Cpu className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                  </div>

                  <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed font-medium whitespace-pre-line border ${
                    isAi
                      ? "bg-bg-warm/50 border-border-soft text-text-dark rounded-tl-xs"
                      : "bg-primary-800 border-primary-750 text-white rounded-tr-xs"
                  }`}>
                    {msg.text}
                    <div className={`text-[8px] mt-1.5 text-right ${isAi ? "text-text-muted" : "text-primary-200"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-3 mr-auto max-w-[85%] animate-pulse">
                <div className="w-8 h-8 rounded-full bg-primary-900 border border-primary-850 text-accent-300 flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-bg-warm/50 border border-border-soft rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-75" />
                  <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce delay-225" />
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-border-soft pt-3 mb-3 shrink-0">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-2 select-none">
              Suggested quick questions:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-3 py-1.5 border border-border-soft hover:border-primary-600 hover:text-primary-800 bg-bg-warm/30 rounded-full text-[10px] font-bold text-text-muted transition-colors cursor-pointer whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="flex gap-2.5 border-t border-border-soft pt-3.5 shrink-0">
            <input
              type="text"
              placeholder="Ask Guru AI about crops, pests, market, or schemes..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isTyping}
              className="flex-1 px-4 py-2.5 border border-border-soft bg-bg-warm/30 rounded-xl text-xs focus:outline-none focus:border-primary-500 focus:bg-white transition-all disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={isTyping || !inputText.trim()}
              className="px-4 py-2.5 shrink-0"
              icon={Send}
            >
              Send
            </Button>
          </form>

        </Card>

      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
};
export default AIGuru;
