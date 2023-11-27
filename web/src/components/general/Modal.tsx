import React, { useEffect, useState } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (memoryName: string) => void;
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [memoryName, setMemoryName] = useState("");
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);

    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onClose]);

  const handleCreateClick = () => {
    onCreate(memoryName);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">New Memory</h2>
        <input
          type="text"
          placeholder="Memory Name..."
          className="mb-4 p-2 w-full border rounded"
          value={memoryName}
          onChange={(e) => setMemoryName(e.target.value)}
        />
        <button
          className="bg-pink-500 text-white p-2 rounded"
          onClick={handleCreateClick}
        >
          Create
        </button>
      </div>
    </div>
  );
};
