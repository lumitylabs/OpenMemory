import { relativeTime } from "../../../utils/utils";

export function CardTime(props: any) {
  return (
    <div className="text-[#909090] text-xs">
      {props.memory.timestamp
        ? relativeTime(Number(props.memory.timestamp))
        : ""}
    </div>
  );
}
