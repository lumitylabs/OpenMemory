export function InfoMemoryCardDescription(props: any) {
  return (
    <div className="xl:w-[300px] w-[150px] h-[100px] text-[#dadada] overflow-clip overflow-ellipsis font-Mada font-semibold tracking-tight  xl:text-[18px]">
      {props.description}
    </div>
  );
}
