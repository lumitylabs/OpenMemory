import ImgComponent from "../general/manager/img-manager/ImgComponent";

export const Reminders = ({ reminders }: { reminders: string[] }) =>
  reminders.length > 0 ? (
    <div className="border p-4 rounded-3xl border-[#393939] xl:w-[300px] mt-10 xl:mt-0">
      <h2 className="text-lg mb-3 font-NotoSansDisplay font-semibold text-[#A4A4A4] overflow-hidden whitespace-normal flex gap-2">
        <ImgComponent name="Pin" type="reminder-button" />
        <div>Reminders</div>
      </h2>

      <div className="flex flex-wrap mb-32 p-2">
        {reminders.length > 0
          ? reminders.map((rem: string, idx: number) => {
            return (
              <span
                key={idx}
                className="text-[#A4A4A4] font-NotoSansDisplay overflow-hidden whitespace-normal"
              >
                • {rem}
              </span>
            );
          })
          : ""}
      </div>
    </div>
  ) : (
    ""
  );
