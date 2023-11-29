import React, { useState, useEffect, useCallback, useRef } from "react";
import MulticolorComponent from "../manager/svg-manager/MulticolorComponent";
import { useSelectMemory } from "../../../hooks/useSelectMemory";
import { useDeleteMemory } from "../../../hooks/useDeleteMemory";
import { useProcessMemory } from "../../../hooks/useProcessMemory";
import { useExportMemory } from "../../../hooks/useExportMemory";
import { SpinAnimation } from "../utils";
import { truncateString } from "../../../utils/utils";

interface Memory {
  id: string;
  name: string;
}

interface MemoryListProps {
  memories: Memory[];
  selectedMemory: Memory | null;
  refreshMemories: () => void;
  isImporting: boolean;
  isCapturing: boolean;
}

const OptionsMenu = React.forwardRef<
  HTMLDivElement,
  {
    options: string[];
    onProcess: () => void;
    onExport: () => void;
    onDelete: () => void;
  }
>(({ options, onProcess, onExport, onDelete }, ref) => (
  <div
    className="absolute right-0 mt-2 w-[126px] bg-white shadow-lg rounded-md py-2 z-10 "
    ref={ref}
  >
    {options.map((option) => (
      <div
        key={option}
        className={`px-4 py-1 hover:bg-[#fff0fe] font-Mada font-medium tracking-tight ${
          option === "Delete" ? "text-red-400" : "text-[#3b444d]"
        } cursor-pointer`}
        onClick={() => {
          if (option === "Process") {
            onProcess();
          } else if (option === "Export") {
            onExport();
          } else if (option === "Delete") {
            onDelete();
          }
        }}
      >
        {option}
      </div>
    ))}
  </div>
));

function createDownloadLink(blob: any, fileName: any) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

const MemoryList: React.FC<MemoryListProps> = ({
  memories,
  selectedMemory,
  refreshMemories,
  isImporting,
  isCapturing
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const menuRef = useRef<(HTMLDivElement | null)[]>([]);
  const selectMemory = (memoryId: any, index: number) => {
    handleMemorySelect(index);
    useSelectMemory({ memory_id: memoryId })
      .then(() => {})
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
      const selectedIndex = memories.findIndex(
        (memory) => memory.id == selectedMemory.id
      );

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

  const onExport = async (memory: Memory) => {
    useExportMemory(Number(memory.id))
      .then((blob) => {
        createDownloadLink(blob, memory.name + ".zip");
      })
      .catch((error) => {
        console.error("Error exporting memory:", error);
      });
    setMenuOpen(null);
  };

  return (
    <div className="flex flex-col w-full gap-2 pt-5">
      {memories.map((memory, index) => {
        const onProcess = () => {
          useProcessMemory(memory.id);
          setMenuOpen(null);
        };
        const onDelete = () => {
          if (memory.id !== "0") {
            useDeleteMemory(memory.id).then(() => {
              refreshMemories();
              handleMemorySelect(0);
              useSelectMemory({ memory_id: 0 });
            });
          }
          setMenuOpen(null);
        };
        const options = ["Process", "Export"];
        if (memory.id !== "0") {
          options.push("Delete");
        }
        return (
          <div
            key={memory.id}
            className={`group flex px-4 py-2 items-center justify-between rounded-[9px] ${
              selected === index
                ? "bg-white bg-opacity-20"
                : "hover:bg-white hover:bg-opacity-10 transition duration-300 ease-in-out"
            } cursor-pointer`}
            onClick={() => selectMemory(memory.id, index)}
          >
            <div className="flex items-center">
              <span
                className={`h-[6px] w-[6px] ${
                  selected === index && isCapturing ? "bg-green-500" : ""
                } rounded-full mr-2`}
              ></span>
              <span
                className={`font-Mada font-semibold text-[18px] tracking-tight ${
                  selected === index
                    ? "text-white"
                    : "text-[#B0D0DE] group-hover:text-white"
                } truncate max-w-[243px]`}
              >
                {truncateString(memory.name, 30)}{" "}
                {/* Aqui aplicamos a função de truncar */}
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
                  options={options}
                  onProcess={onProcess}
                  onExport={() => onExport(memory)}
                  onDelete={onDelete}
                />
              )}
            </div>
          </div>
        );
      })}
      {isImporting && (
        <div className="flex items-center justify-between px-4 py-2 rounded-[9px]">
          <div className="flex items-center">
            <span className={`h-[6px] w-[6px] rounded-full mr-2`}></span>{" "}
            <span className="font-Mada font-semibold text-[18px] tracking-tight text-[#B0D0DE]">
              Importing...
            </span>
          </div>
          <SpinAnimation height={18} width={18} />
        </div>
      )}
    </div>
  );
};

export default MemoryList;
