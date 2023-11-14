

interface ChatMessageProps {
  sender: "user" | "bot";
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ sender, content }) => {
  return (
    <div
      className={`my-4 p-2 pl-4 rounded-xl ${
        sender === "bot" ? "bg-[#583b58]" : "bg-[#39476e] text-white"
      } max-w-md ${sender === "bot" ? "lg:mr-10" : "lg:ml-10"}`}
    >
      {content}
    </div>
  );
};

export default ChatMessage;
