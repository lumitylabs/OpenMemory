import { formatDate } from "../../../utils/utils";
import MulticolorComponent from "../../general/manager/svg-manager/MulticolorComponent";

export function CalendarButton(props: any) {
  return (
    <div>
      <button
        className="flex text-[#E4E4E4] text-xs iphone5:text-base iphone5:p-3 iphone5:pl-6 iphone5:pr-6 pl-3 pr-3 border rounded-[17px] border-[#444444] iphone5:gap-4 items-center hover:bg-[#fff] hover:bg-opacity-10"
        onClick={() => props.setShowModal(true)}
      >
        <MulticolorComponent
          name="Calendar"
          baseColor="#E4E4E4"
          selectedColor="#E4E4E4"
          isSelected={false}
          classParameters="w-[26px] h-[26px]"
        />
         <div className="text-sm flex flex-nowrap w-[100px]">{formatDate(props.state.startDate)} - {formatDate(props.state.endDate)}</div>
      </button>
    </div>
  );
}
