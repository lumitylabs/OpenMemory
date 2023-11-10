import { CardTime } from "./CardTime";
import { CardTitle } from "./CardTitle";

export function CardHeader(props: any) {
  return (
    <div>
      <CardTime memory={props.memory}></CardTime>
      <CardTitle title={props.memory.title} idx={props.idx}></CardTitle>
    </div>
  );
}
