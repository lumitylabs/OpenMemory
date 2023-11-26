export function SelectProcess(props: any) {
  return (
    <div className="text-[#E4E4E4] bg-black w-[220px] p-3 rounded-[18px] outline-0 border border-[#444444] hover:bg-[#fff] hover:bg-opacity-10 cursor-pointer">
      <select
        className="flex bg-black"
        value={props.selectedProcess}
        onChange={(e) => props.setSelectedProcess(e.target.value)}
      >
        {props.stringProcesses.map((option: any, index: any) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
