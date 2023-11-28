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
      <div className="flex p-9 flex-col bg-white rounded-[27px] shadow-lg">
        <h2 className="font-Mada font-semibold text-[27px] tracking-tight mb-4">
          New Memory
        </h2>
        <input
          type="text"
          placeholder="Memory Name"
          className="flex w-[300px] p-2 border rounded-[9px] font-Mada font-semibold placeholder:font-medium tracking-tight border-[#b3b3b3] focus:outline-none focus:shadow-sm focus:border-[#000] transition duration-300 ease-in-out"
          value={memoryName}
          onChange={(e) => setMemoryName(e.target.value)}
        />
        <div className="flex justify-end mt-9">
          <button
            className="flex justify-center bg-[#D458C8] hover:bg-[#db5ecf] shadow-md w-[100px] p-2 rounded-[9px] transition duration-300 ease-in-out"
            onClick={handleCreateClick}
          >
            <span className="font-Mada font-semibold tracking-tight text-white">
              {" "}
              Create
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
