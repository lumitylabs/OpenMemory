export function CardTitle(props: any) {
  var odd = Number(props.idx) % 2 == 0;
  var color = odd ? "text-[#D458C8]" : "text-[#4AB7E5]";

  return (
    <div className={"text-2xl font-Mada font-semibold tracking-tight " + color}>
      {props.title}
    </div>
  );
}
