export function SelectProcess(props: any) {
  return (
    <select
      className="text-[#E4E4E4] bg-[#363636] rounded-full outline-0"
      value={props.selectedProcess}
      onChange={(e) => props.setSelectedProcess(e.target.value)}
    >
      {props.stringProcesses.map((option: any, index: any) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
