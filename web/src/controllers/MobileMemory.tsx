import React, { useState } from "react";
import { InfoMemoryCard } from "../components/home/info-memory-card/InfoMemoryCard";
import ImgComponent from "../components/general/manager/img-manager/ImgComponent";
import MulticolorComponent from "../components/general/manager/MulticolorComponent";

function MobileMemory(props: { imgBase: string; memory: any; setShowInfo: any; showInfo: any; }) {
 
  const toggleShowInfo = () => {
    props.setShowInfo(!props.showInfo);
  };

  const infoMemory = (
    <InfoMemoryCard
      imgBase={props.imgBase}
      memory={props.memory}
    ></InfoMemoryCard>
  );
  const infoButton = (
    <div className="cursor-pointer" onClick={toggleShowInfo}>
      <MulticolorComponent
        name="TextIcon"
        baseColor={""}
        selectedColor={""}
        isSelected={false}
        classParameters={""}
      ></MulticolorComponent>
    </div>
  );
  return (
    <div className="flex flex-col items-center">
      <div className="w-[1px] h-[15px] bg-[#444444]"></div>
      {infoButton}
      {props.showInfo ? (
        <div className="flex flex-col items-center">
          <div className="w-[1px] h-[15px] bg-[#444444]"></div>
          {infoMemory}
        </div>
      ): ""}
    </div>
  );
}

export default MobileMemory;
