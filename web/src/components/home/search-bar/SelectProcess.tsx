import { useState, useRef, useEffect } from "react";
import MulticolorComponent from "../../general/manager/svg-manager/MulticolorComponent";
import { truncateString } from "../../../utils/utils";

interface Memory {
  id: string;
  name: string;
}

export function SelectProcess(props: {
  memoriesList: Memory[];
  selectedMemoryId: number;
  setSelectedMemoryId: (id: number) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (memory: Memory) => {
    props.setSelectedMemoryId(memory.id === "-1" ? -1 : parseInt(memory.id));
    setDropdownOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayText =
    props.memoriesList.find(
      (m: Memory) => m.id === props.selectedMemoryId.toString()
    )?.name || "All Memories";

  const truncatedText = (text: string) => truncateString(text, 14);

  return (
    <div
      ref={dropdownRef}
      className="relative text-[#E4E4E4] bg-black w-[220px] rounded-[18px] border border-[#444444] hover:bg-[#121212] cursor-pointer select-none"
    >
      <div
        className="flex items-center min-w-[190px] max-w-[190px] px-4 py-3 pr-8 rounded-[18px] outline-none font-semibold truncate"
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        {truncatedText(displayText)}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[red]">
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
          {props.memoriesList.map((memory: Memory, index: number) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-[#fff0fe] rounded-md cursor-pointer text-[#3b444d] font-semibold"
              onClick={() => handleSelect(memory)}
            >
              {truncateString(memory.name, 20)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
