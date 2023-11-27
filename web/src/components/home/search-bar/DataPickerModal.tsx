import { DateRange, DateRangePicker } from "react-date-range";

export function DataPickerModal(props: any) {
  return (
    <div className="">
      {props.showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg flex flex-col items-end ">
            {props.isLargeScreen ? (
              <DateRangePicker
                onChange={(item) => props.setState([item.selection])}
                showPreview={true}
                moveRangeOnFirstSelection={false}
                ranges={props.state}
                direction="horizontal"
              />
            ) : (
              <DateRange
                editableDateInputs={true}
                onChange={(item) => props.setState([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={props.state}
              />
            )}
            <button
              className="mt-10 bg-blue-500 text-white p-2 w-[100px] rounded-lg"
              onClick={() => props.setShowModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
