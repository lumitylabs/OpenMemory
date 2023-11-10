export function InfoMemoryCardDescription(props: any) {
  return (
    <div className="xl:w-[300px] w-[150px] h-[100px] text-[#A4A4A4] overflow-clip overflow-ellipsis text-sm xl:text-base">
      {props.description}
    </div>
  );
}
