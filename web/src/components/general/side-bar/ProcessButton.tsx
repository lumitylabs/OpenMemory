import React from "react";
import MulticolorComponent from "../manager/svg-manager/MulticolorComponent";
import { useProcessAll } from "../../../hooks/useProcessAll";

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

  const loadingSVG = (
    <MulticolorComponent
      name="Stop"
      baseColor="#fff"
      selectedColor="#fff"
      isSelected={false}
      classParameters="h-[27px] w-[27px]"
    />
  );

  return (
    <button
      onClick={handleButtonClick}
      aria-pressed={isActive}
      className={`${
        isActive
          ? "bg-[#111111] border-black"
          : "bg-transparent hover:bg-white hover:bg-opacity-10"
      } flex w-[160px] border tracking-tight justify-center items-center text-white font-Mada font-semibold text-[18px] py-2 rounded-[12px] transition duration-300 ease-in-out focus:outline-none shadow-lg`}
    >
      {isActive ? loadingSVG : ""}
      {isActive ? "Processing..." : "Process All"}
    </button>
  );
};

export default ProcessButton;
