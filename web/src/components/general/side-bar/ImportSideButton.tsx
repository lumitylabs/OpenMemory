import MulticolorComponent from "../manager/svg-manager/MulticolorComponent";

export function ImportSideButton() {
  return (
    <div className="flex w-min items-center border border-white border-opacity-40 rounded-[12px] bg-transparent cursor-pointer hover:bg-white hover:bg-opacity-10 transition duration-300 ease-in-out">
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
