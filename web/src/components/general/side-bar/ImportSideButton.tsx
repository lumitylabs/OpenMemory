import { useRef, ChangeEvent } from 'react';
import MulticolorComponent from "../manager/svg-manager/MulticolorComponent";

interface ImportSideButtonProps {
  onFileSelected: (file: File) => void;
}

export function ImportSideButton({ onFileSelected }: ImportSideButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      onFileSelected(file);
      event.target.value = '';
    }
  };

  return (
    <div className="flex w-min items-center border border-white border-opacity-40 rounded-[12px] bg-transparent cursor-pointer hover:bg-white hover:bg-opacity-10 transition duration-300 ease-in-out" onClick={handleClick}>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept=".zip"/>
      <MulticolorComponent
        name="Import"
        baseColor="transparent"
        selectedColor=""
        isSelected={false}
        classParameters="h-[27px] w-[27px] m-2"
      />
    </div>
  );
}
