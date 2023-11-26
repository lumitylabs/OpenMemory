import MulticolorComponent from "../../general/manager/svg-manager/MulticolorComponent";

export function InfoMemoryCardButton(props: any) {
  return (
    <button
      className="flex gap-2 border-2 iphone5:w-[90px] xl:w-[120px] justify-center p-1 rounded-[16px] custom-shadow hover:shadow-none hover:bg-[#fff] hover:bg-opacity-10 items-center select-none transition duration-300 ease-in-out"
      onClick={() => (window.location.href = "/memory/" + props.timestamp)}
    >
      <MulticolorComponent
        name="Logo"
        baseColor="#fff"
        selectedColor=""
        isSelected={false}
        classParameters="h-[34px] w-[24px]"
      />
      <div className="font-Mada text-white text-[18px]">Remind</div>
    </button>
  );
}
