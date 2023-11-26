import { useState } from "react";
import MulticolorComponent from "../../general/manager/svg-manager/MulticolorComponent";

export function SelectProcess(props: any) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="relative text-[#E4E4E4] bg-black w-[220px] rounded-[18px] border border-[#444444] hover:bg-[#121212] cursor-pointer">
      <div
        className="px-4 py-3 pr-8 rounded-[18px] outline-none"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {props.selectedProcess || "Select an option"}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <MulticolorComponent
            name="ArrowDown"
            baseColor="#fff"
            selectedColor=""
            isSelected={false}
            classParameters="h-[20px] w-[20px]"
          />
        </div>
      </div>
      {dropdownOpen && (
        <div className="absolute z-10 w-full bg-white rounded-md shadow-lg">
          {props.stringProcesses.map((option: any, index: any) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer text-[#000]"
              onClick={() => {
                props.setSelectedProcess(option);
                setDropdownOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
