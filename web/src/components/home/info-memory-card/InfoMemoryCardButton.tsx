import ImgComponent from "../../general/manager/img-manager/ImgComponent";

export function InfoMemoryCardButton(props: any) {
  return (
    <div
      className="text-white border-2 iphone5:w-[90px] xl:w-[100px] flex justify-center p-1 rounded-full custom-shadow select-none cursor-pointer gap-2 items-center"
      onClick={() => (window.location.href = "/memory/" + props.timestamp)}
    >
      <ImgComponent name="Brain" type="icons-button" />
      <div className="text-sm xl:text-base">Remind</div>
    </div>
  );
}
