import MulticolorComponent from "../manager/svg-manager/MulticolorComponent";

export function SideSearchInput() {
  return (
    <div className="flex w-full items-center border border-white border-opacity-40 rounded-[12px] bg-transparent focus-within:bg-white focus-within:bg-opacity-10 tracking-tight transition duration-300 ease-in-out">
      <MulticolorComponent
        name="Search"
        baseColor="#75A8BD"
        selectedColor=""
        isSelected={false}
        classParameters="h-[27px] w-[27px] m-2"
      />

      <input
        type="text"
        placeholder="Memory name..."
        className="w-full font-Mada font-semibold py-2 text-[18px] placeholder-[#75A8BD] tracking-tight text-white bg-transparent focus:outline-none"
      />
    </div>
  );
}
