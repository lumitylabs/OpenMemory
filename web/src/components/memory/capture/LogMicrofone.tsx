import { convertTimestampToHoursMinutes } from "../../../utils/utils";
import { ChatHeader, ChatBottom } from "./UnifiedData";

export function LogMicrofone(props: any) {
  return (
    <div className="font-Mada font-semibold text-[#A4A4A4] mb-6">
      <div className="flex flex-col gap-6">
        {props.isAudioMicrofone && !props.isPrevAudioMicrofone && (
          <ChatHeader />
        )}
        <div className="flex items-center gap-1 xl:gap-6 flex-wrap xl:flex-nowrap">
          <div className="font-Mada font-semibold text-[#444444] w-[50px] ml-[30px] xl:ml-0">
            {props.item.timestamp
              ? convertTimestampToHoursMinutes(Number(props.item.timestamp))
              : ""}
          </div>
          <div className="w-full xl:w-[1000px] xl:pl-4 xl:pr-4 ml-[30px] xl:ml-0">
            {props.item.content}
          </div>
        </div>
        {props.isAudioMicrofone && !props.isNextAudioMicrofone && (
          <ChatBottom />
        )}
      </div>
    </div>
  );
}
