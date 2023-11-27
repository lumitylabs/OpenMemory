import { convertTimestampToHoursMinutes } from "../../../utils/utils";
import MulticolorComponent from "../../general/manager/svg-manager/MulticolorComponent";

export function LogSystemAudio(props: any) {
  return (
    <div className="font-Mada font-semibold text-[#A4A4A4] w-fit flex items-center mb-10 gap-6 flex-wrap xl:flex-nowrap">
      <div className="font-Mada font-semibold text-[#444444] w-[60px]  ml-[30px] xl:ml-[0px]">
        {props.item.timestamp
          ? convertTimestampToHoursMinutes(Number(props.item.timestamp))
          : ""}
      </div>
      <div className="w-[1000px] border rounded-xl p-4 border-[#444444] flex flex-col gap-4  ml-[30px] xl:ml-[0px]">
        <div className="flex gap-4 items-center text-[#444444]">
          <MulticolorComponent
            name="SystemSound"
            baseColor={"#444444"}
            selectedColor={""}
            isSelected={false}
            classParameters={"h-6 w-6"}
          />
          {props.item.processes.replace(",", ", ")}
        </div>
        {props.item.content}
      </div>
    </div>
  );
}
