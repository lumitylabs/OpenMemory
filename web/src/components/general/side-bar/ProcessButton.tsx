import React from "react";
import { useProcessAll } from "../../../hooks/useProcessAll";
import { SpinAnimation } from "../utils";

interface ProcessButtonProps {
  onClick?: () => void;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
}

const ProcessButton: React.FC<ProcessButtonProps> = ({
  onClick,
  isActive,
  setIsActive,
}) => {
  const handleButtonClick = () => {
    onClick?.();
    if (!isActive) {
      setIsActive(true);
      useProcessAll();
    }
  };

  return (
    <button
      onClick={handleButtonClick}
      aria-pressed={isActive}
      className={`${
        isActive
          ? "bg-[#111111] border-black"
          : "bg-transparent hover:bg-white hover:bg-opacity-10"
      } flex gap-2 w-[160px] border tracking-tight justify-center items-center text-white font-Muda font-semibold text-[18px] py-2 rounded-[12px] transition duration-300 ease-in-out focus:outline-none shadow-lg`}
    >
      {isActive ? <SpinAnimation height={18} width={18}/> : ""}
      {isActive ? "Processing..." : "Process All"}
    </button>
  );
};

export default ProcessButton;
