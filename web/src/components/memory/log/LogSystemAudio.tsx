import { convertTimestampToHoursMinutes } from "../../../utils/utils";
import MulticolorComponent from "../../general/manager/MulticolorComponent";

export function LogSystemAudio(props: any) {
  return (
    <div className="text-[#A4A4A4] flex items-center mb-10 gap-6 flex-wrap xl:flex-nowrap">
      <div className="text-[#444444] w-[60px]  ml-[30px] xl:ml-[0px]">
        {props.item.timestamp
          ? convertTimestampToHoursMinutes(Number(props.item.timestamp))
          : ""}
      </div>
      <div className="w-[1000px] border rounded-xl p-4 border-[#444444] flex flex-col gap-4  ml-[30px] xl:ml-[0px]">
        <div className="flex gap-4 items-center text-[#8D8D8D]">
          <MulticolorComponent
            name="SystemSound"
            baseColor={""}
            selectedColor={""}
            isSelected={false}
            classParameters={""} />
          {props.item.processes.replace(",", ", ")}
        </div>
        {props.item.content}
      </div>
    </div>
  );
}
