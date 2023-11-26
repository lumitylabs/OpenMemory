import MulticolorComponent from "../manager/svg-manager/MulticolorComponent";

export function SideLogo() {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none">
      <MulticolorComponent
        name="Logo"
        baseColor="#fff"
        selectedColor=""
        isSelected={false}
        classParameters="h-[54px] w-[54px]"
      />
      <h1 className="text-white font-Sarabun text-[36px] font-extrabold tracking-tight">
        OpenMemory
      </h1>
    </div>
  );
}
