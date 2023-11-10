import React, { useState } from "react";
import ChatMessage from "./ChatMessage";

type ChatMessageType = {
  sender: "bot" | "user";
  content: string;
};

const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    
    { sender: "user", content: "I want to talk with my memories" },
    { sender: "bot", content: "Sorry, not avalible yet." },
  ]);

  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        { sender: "user", content: inputValue.trim() },
      ]);
      setInputValue("");
    }
  };

  return (
    <div className="justify-end items-end h-full lg:flex">
      <div className="flex flex-col bg-[#202020] text-white mt-24 mb-[20px] h-[calc(100%-126px)] lg:w-80 lg:p-6 p-3 border-0 rounded-3xl">
        <h2 className="text-xl mt-4 mb-6">MemoryBot</h2>
        <div className="w-full h-0.5 bg-[#292929] mb-6"></div>
        <div className="flex-1 overflow-y-auto">
          {messages.map((message, idx) => (
            <ChatMessage key={idx} {...message} />
          ))}
        </div>
        <div className="p-4 flex bg-[#363636] rounded-3xl justify-between">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything..."
            className="bg-[#363636] resize-none w-full outline-0"
          />
          <button
            onClick={handleSend}
            className="relative flex justify-center items-center bg-blue-500 rounded-md p-2 w-[24px] h-[24px]"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
