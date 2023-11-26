import React, { useState } from "react";
import MulticolorComponent from "../manager/svg-manager/MulticolorComponent";
import { useStartCapture } from "../../../hooks/useStartCapture";
import { useStopCapture } from "../../../hooks/useStopCapture";

interface CaptureButtonProps {
  onClick?: () => void;
  isActive: boolean;
  setIsActive: (active: boolean) => void;
}

const CaptureButton: React.FC<CaptureButtonProps> = ({ onClick, isActive, setIsActive }) => {

  const handleButtonClick = () => {
    setIsActive(!isActive);
    onClick?.();
    if (!isActive) {
      useStartCapture();
    } else {
      useStopCapture();
    }
  };

  const captureSVG = (
    <MulticolorComponent
      name="Play"
      baseColor="#fff"
      selectedColor="#fff"
      isSelected={false}
      classParameters="h-[27px] w-[27px] mr-2"
    />
  );

  const stopSVG = (
    <MulticolorComponent
      name="Stop"
      baseColor="#fff"
      selectedColor="#fff"
      isSelected={false}
      classParameters="h-[27px] w-[27px] mr-2"
    />
  );

  return (
    <button
      onClick={handleButtonClick}
      aria-pressed={isActive}
      className={`${
        isActive
          ? "bg-[#4AB7E5] border-[#4AB7E5] hover:bg-[#50BFEE] hover:border-[#50BFEE]"
          : "bg-[#D458C8] border-[#D458C8] hover:bg-[#d16bc7] hover:border-[#d16bc7]"
      } flex w-[160px] border tracking-tight justify-center items-center text-white font-Muda font-semibold text-[18px] py-2 rounded-[12px] transition duration-300 ease-in-out focus:outline-none shadow-lg`}
    >
      {isActive ? stopSVG : captureSVG}
      {isActive ? "Stop" : "Capture"}
    </button>
  );
};

export default CaptureButton;
