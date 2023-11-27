import MulticolorComponent from "../general/manager/svg-manager/MulticolorComponent";

export const Reminders = ({ reminders }: { reminders: string[] }) =>
  reminders.length > 0 ? (
    <div className="flex flex-wrap mb-32 p-2">
      {reminders.map((rem: string, idx: number) => (
        <span
          key={idx}
          className="text-[#498CA9] font-Mada font-semibold mt-2 overflow-hidden whitespace-normal"
        >
          • {rem}
        </span>
      ))}
    </div>
  ) : (
    <div className="flex h-full justify-center items-center">
      <div className="flex flex-col text-[#2d5869] justify-center ">
        <div className="flex h-full w-full justify-center">
          <MulticolorComponent
            name={"Remind"}
            baseColor={"#2d5869"}
            selectedColor={""}
            isSelected={false}
            classParameters={"w-[27px] h-[27px]"}
          ></MulticolorComponent>
        </div>
        <span className=" font-Mada font-semibold text-[#2d5869]">
          No reminders here
        </span>
      </div>
    </div>
  );
