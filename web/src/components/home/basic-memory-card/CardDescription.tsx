export function CardDescription(props: any) {
  return (
    <div className="text-[#A4A4A4] max-h-[140px] text-ellipsis overflow-hidden">
      {props.description}
    </div>
  );
}
