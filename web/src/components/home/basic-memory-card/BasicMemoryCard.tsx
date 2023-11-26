import { useEffect, useState } from "react";
import MulticolorComponent from "../../general/manager/svg-manager/MulticolorComponent";
import { CardDescription } from "./CardDescription";
import { CardHeader } from "./CardHeader";

export function BasicMemoryCard(props: any) {
  const [showDescription, setShowDescription] = useState(false);

  const toggleDescription = () => {
    setShowDescription(!showDescription);
  };

  return (
    <div className="flex items-center">
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
