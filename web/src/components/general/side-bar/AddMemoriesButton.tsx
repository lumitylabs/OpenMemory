// AddMemoriesButton.tsx
import { useState } from "react";
import MulticolorComponent from "../manager/svg-manager/MulticolorComponent";
import { Modal } from "../Modal";
import { useCreateMemory } from "../../../hooks/useCreateMemory";

interface AddMemoriesButtonProps {
  refreshMemories: () => void;
}

export function AddMemoriesButton({ refreshMemories }: AddMemoriesButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCreateMemory = (memoryName:string) => {
    useCreateMemory(memoryName)
      .then(() => {
        refreshMemories();
      })
      .catch((error) => {
        console.error("Error creating memory:", error);
      });
    setIsModalOpen(false); // Close the modal
  };
  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="flex w-min items-center border border-white border-opacity-40 rounded-[12px] bg-transparent cursor-pointer hover:bg-white hover:bg-opacity-10 transition duration-300 ease-in-out"
      >
        <MulticolorComponent
          name="Add"
          baseColor="transparent"
          selectedColor=""
          isSelected={false}
          classParameters="h-[27px] w-[27px] m-2"
        />
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onCreate={handleCreateMemory} />
    </>
  );
}
