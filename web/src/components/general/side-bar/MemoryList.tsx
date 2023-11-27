import React, { useState, useEffect, useCallback, useRef } from "react";
import MulticolorComponent from "../manager/svg-manager/MulticolorComponent";
import { useSelectMemory } from "../../../hooks/useSelectMemory";

interface Memory {
  id: string;
  name: string;
}

interface MemoryListProps {
  memories: Memory[];
  selectedMemory: Memory | null;
}

const OptionsMenu = React.forwardRef<
  HTMLDivElement,
  { options: string[]; memory: string }
>(({ options, memory }, ref) => (
  <div
    className="absolute right-0 mt-2 w-[126px] bg-white shadow-lg rounded-md py-2 z-10 "
    ref={ref}
  >
    {options.map((option) => (
      <div
        key={option}
        className={`px-4 py-1 hover:bg-[#fff0fe]  font-Mada font-medium tracking-tight ${
          option === "Delete" ? "text-red-400" : "text-[#3b444d]"
        } cursor-pointer`}
        onClick={() => console.log(option, memory)}
      >
        {option}
      </div>
    ))}
  </div>
));

const MemoryList: React.FC<MemoryListProps> = ({ memories, selectedMemory }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const menuRef = useRef<(HTMLDivElement | null)[]>([]);
  const selectMemory = (memoryId:any, index:number) => {
    handleMemorySelect(index);
    useSelectMemory({'memory_id': memoryId})
      .then(() => {
      })
      .catch((error) => {
        console.error("Error selecting memory:", error);
      });
  };
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      !menuRef.current.some((ref) => ref && ref.contains(event.target as Node))
    ) {
      setMenuOpen(null);
    }
  }, []);

  useEffect(() => {

    if (selectedMemory) {
      const selectedIndex = memories.findIndex(memory => memory.id == selectedMemory.id);

      setSelected(selectedIndex);
    }
  }, [memories, selectedMemory]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  const handleMemorySelect = useCallback((index: number) => {
    setSelected(index);
  }, []);

  const handleMoreClick = useCallback(
    (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setSelected(index);
      setMenuOpen(menuOpen === index ? null : index);
    },
    [menuOpen]
  );

  return (
    <div className="flex flex-col w-full gap-2 pt-5">
      {memories.map((memory) => {
        const index = memories.indexOf(memory);
        return (
          <div
            key={memory.id} 
            className={`group flex px-4 py-2 items-center justify-between rounded-[9px] ${
              selected === index
                ? "bg-white bg-opacity-10"
                : "hover:bg-white hover:bg-opacity-10 transition duration-300 ease-in-out"
            } cursor-pointer`}
            onClick={() => selectMemory(memory.id, index)} 
          >
            <div className="flex items-center">
              <span className={`h-[6px] w-[6px] ${selected === index ? "bg-green-500" : ""} rounded-full mr-2`}></span>
              <span
                className={`font-Mada font-semibold text-[18px] tracking-tight ${
                  selected === index
                    ? "text-white"
                    : "text-[#B0D0DE] group-hover:text-white"
                }`}
              >
                {memory.name}
              </span>
            </div>
            <div className="relative">
              <button
                className="text-white"
                onClick={(event) => {
                  event.stopPropagation(); 
                  handleMoreClick(index, event);
                }}
              >
                <MulticolorComponent
                  name="More"
                  baseColor="#fff"
                  selectedColor="#fff"
                  isSelected={menuOpen === index}
                  classParameters="h-[27px] w-[27px]"
                />
              </button>
              {menuOpen === index && (
                <OptionsMenu
                  ref={(el) => (menuRef.current[index] = el)}
                  options={["Process", "Export", "Delete"]}
                  memory={memory.name} // Passando o nome da memória
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
  
};

export default MemoryList;
