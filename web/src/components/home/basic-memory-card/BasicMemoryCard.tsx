import React, { useEffect, useState } from "react";
import MulticolorComponent from "../../general/manager/MulticolorComponent";
import { CardDescription } from "./CardDescription";
import { CardHeader } from "./CardHeader";

export function BasicMemoryCard(props: any) {
  const [isMediumScreen, setIsMediumScreen] = useState(
    window.innerWidth >= 768
  );
  const [isFoldScreen, setIsFoldScreen] = useState(window.innerWidth <= 280);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1600);
  const [showDescription, setShowDescription] = useState(false);

  const calculateHeight = () => {
    const base = showDescription ? isFoldScreen ? 34 : 22 : 0;
    var value = 0;
    if (props.showInfo) {
      value = !isFoldScreen ? 580 : 745;
    } else {
      value= !isFoldScreen ? (isLargeScreen ? 400 : 270) : 280;
    }
    return value + base;
  };


  const height = calculateHeight();
  var reduce = isLargeScreen
    ? "w-[30px]"
    : isMediumScreen
    ? `absolute left-2 w-[calc(50%-150px-8px-12.5%)]`
    : isFoldScreen
    ? `absolute left-2 w-[calc(50%-150px-8px+35px)]`
    : `absolute left-2 w-[calc(50%-150px-8px)]`;

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsFoldScreen(window.innerWidth <= 280);
      setIsMediumScreen(window.innerWidth >= 768);
      setIsLargeScreen(window.innerWidth >= 1600);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex items-center">
      <div className={`${reduce} h-[1px] bg-[#444444]`}>
        <div
          className={`absolute w-[1px] xl:h-[400px] bg-[#444444]`}
          style={{
            height: height
          }}
        ></div>
      </div>
      <div className="text-[#A4A4A4] border border-[#444444] rounded-2xl p-4 text-sm font-NotoSansDisplay w-[230px] iphone5:w-[300px] flex flex-col gap-3">
        <CardHeader memory={props.memory} idx={props.idx} />
        <div className="flex h-[1px] bg-[#444444]"></div>
        {showDescription && (
          <CardDescription description={props.memory.description} />
        )}
        <div
          className="flex items-end justify-center cursor-pointer"
          onClick={toggleDescription}
        >
          <MulticolorComponent
            name="ShowMoreArrow"
            baseColor="#A4A4A4"
            selectedColor="#D458C8"
            isSelected={false}
            classParameters="w-12 h-12"
          />
        </div>
      </div>
    </div>
  );
}
