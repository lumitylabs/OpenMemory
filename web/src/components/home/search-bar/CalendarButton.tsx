import MulticolorComponent from "../../general/manager/MulticolorComponent";
import { formatDate } from "../../../utils/utils";

export function CalendarButton(props: any) {
  return (<div>
    <button className="text-[#E4E4E4] text-xs iphone5:text-base iphone5:p-3 iphone5:pl-6 iphone5:pr-6 pl-3 pr-3 p-2 bg-[#363636] rounded-full flex iphone5:gap-4 items-center" onClick={() => props.setShowModal(true)}>
      <MulticolorComponent name="Calendar" baseColor="#E4E4E4" selectedColor="#E4E4E4" isSelected={false} classParameters="w-6 h-6" />
      {formatDate(props.state.startDate)} - {formatDate(props.state.endDate)}
    </button>
  </div>);
}
