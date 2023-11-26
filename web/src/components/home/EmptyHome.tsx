import MulticolorComponent from "../general/manager/svg-manager/MulticolorComponent";

export function EmptyHome() {
  return (
    <div className="flex flex-col justify-center gap-9">
      <div className="flex items-center gap-4">
        <MulticolorComponent
          name="Sensors"
          baseColor="#fff"
          selectedColor="#E4E4E4"
          isSelected={false}
          classParameters="w-[36px] h-[36px]"
        />
        <div className="flex flex-col">
          <div className="font-Mada font-bold text-white text-[27px] tracking-tight">
            Memory, Sensors and Capture
          </div>
          <div className="font-Mada font-semibold text-[18px] text-[#7a7a7a] leading-4 tracking-tight">
            Select a memory, activate the sensors and start capturing
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <MulticolorComponent
          name="Process"
          baseColor="#fff"
          selectedColor="#E4E4E4"
          isSelected={false}
          classParameters="w-[36px] h-[36px]"
        />
        <div className="flex flex-col">
          <div className="font-Mada font-bold text-white text-[27px] tracking-tight">
            Processing the data
          </div>
          <div className="font-Mada font-semibold text-[18px] text-[#7a7a7a] leading-4 tracking-tight">
            Process the memory data whenever you prefer
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <MulticolorComponent
          name="Consult"
          baseColor="#fff"
          selectedColor="#E4E4E4"
          isSelected={false}
          classParameters="w-[36px] h-[36px]"
        />
        <div className="flex flex-col">
          <div className="font-Mada font-bold text-white text-[27px] tracking-tight">
            Consult your Memories
          </div>
          <div className="font-Mada font-semibold text-[18px] text-[#7a7a7a] leading-4 tracking-tight">
            Ready! Now just ask questions for your memory
          </div>
        </div>
      </div>
    </div>
  );
}
