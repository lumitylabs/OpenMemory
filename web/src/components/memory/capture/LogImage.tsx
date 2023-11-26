import {
  convertTimestampToHoursMinutes,
  relativeTime,
} from "../../../utils/utils";

export function LogImage(props: any) {
  return (
    <div className="flex xl:items-center gap-3 xl:gap-6 flex-wrap xl:flex-nowrap flex-col xl:flex-row">
      <div className="text-[#444444] w-[60px] ml-[30px] xl:ml-[0px] ">
        {props.item.timestamp
          ? convertTimestampToHoursMinutes(Number(props.item.timestamp))
          : ""}
      </div>
      <img
        key={props.idx}
        src={props.imgBase + props.item.path}
        alt={`Screencapture at ${
          props.item.timestamp ? relativeTime(Number(props.item.timestamp)) : ""
        }`}
        className="ml-[30px] xl:ml-[0px] xl:h-[350px] lg:h-[250px] xl:w-[1000px] w-[230px] object-cover mb-10 xl:mt-6 rounded-2xl custom-shadow-image"
      />
    </div>
  );
}
