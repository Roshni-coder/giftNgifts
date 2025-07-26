import React, { useState, useEffect, useRef } from "react";
import "./ChatBot.css";

const faqMap = [
  {
    keywords: ["order status", "track", "where is my order"],
    reply: "📦 Please share your Order ID and I’ll fetch the current status for you.",
  },
  {
    keywords: ["cancel order", "cancel my order"],
    reply: "❌ You can cancel your order from 'My Orders' page by clicking on 'Cancel' next to the product.",
  },
  {
    keywords: ["refund", "money back", "return money"],
    reply: "💰 Refunds are processed 5–7 business days after the returned product is received.",
  },
  {
    keywords: ["return", "return policy", "product return"],
    reply: "↩️ Returns are accepted within 7 days of delivery if the gift is unused and in original packaging.",
  },
  {
    keywords: ["delivery", "shipping", "how long"],
    reply: "🚚 Standard delivery takes 3–5 business days. Express options are available at checkout!",
  },
  {
    keywords: ["available", "in stock", "stock status"],
    reply: "🛍️ Please mention the product name or ID and I’ll check its availability for you.",
  },
  {
    keywords: ["gift wrap", "wrap", "packing"],
    reply: "🎁 Yes! Free gift wrapping is available — just select the option at checkout.",
  },
  {
    keywords: ["hi", "hello", "hey"],
    reply: "👋 Hello! I’m GiftBot. Ask me anything about your orders, delivery, returns or gifts!",
  },
  {
    keywords: ["thanks", "thank you", "ty"],
    reply: "😊 You're welcome! Happy gifting!",
  },
  {
    keywords: ["contact", "support", "help"],
    reply: "📞 You can reach us at support@giftngifts.com or call +91-9365055344.",
  },
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "👋 Hello! I’m GiftBot. Ask me anything about your orders, delivery, returns or gifts!",
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!userInput.trim()) return;

    const userMsg = { sender: "user", text: userInput };
    const userText = userInput.toLowerCase();

    const match = faqMap.find((faq) =>
      faq.keywords.some((keyword) => userText.includes(keyword))
    );

    const botReply = match
      ? match.reply
      : "🤖 Sorry, I didn’t understand that. Please ask something related to orders, returns, or delivery.";

    const botMsg = { sender: "bot", text: botReply };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setUserInput("");
  };

  return (
    <>
      {!isOpen && (
        <button className="chat-toggle-btn" onClick={() => setIsOpen(true)}>
          💬 Chat with us
        </button>
      )}

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            🎁 GiftBot
            <span className="close-btn" onClick={() => setIsOpen(false)}>
              ✖
            </span>
          </div>
          <div className="chatbot-body">
            {messages.map((msg, idx) => (
              <div key={idx} className={`message ${msg.sender}`}>
                <div className="bubble">{msg.text}</div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <div className="chatbot-input">
            <input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your gift..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
