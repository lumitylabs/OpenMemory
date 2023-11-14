
import { relativeTime } from "../../utils/utils";

export const Timestamp = ({ timestamp }: { timestamp: string | number }) => (
    <p className="text-base mb-1 text-[#AFAFAF] overflow-hidden whitespace-normal">
      {timestamp ? relativeTime(Number(timestamp)) : ""}
    </p>
  );