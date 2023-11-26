import { InfoMemoryCardButton } from "./InfoMemoryCardButton";
import { InfoMemoryCardDescription } from "./InfoMemoryCardDescription";
import { InfoMemorySubject } from "./InfoMemorySubject";
import { QuotationMarks } from "./QuotationMarks";

export function InfoMemoryCard(props: any) {
  return (
    <div
      className="h-[450px] iphone5:h-[300px] xl:h-[350px] xl:w-[740px] flex justify-center flex-wrap iphone5:flex-nowrap w-[250px] iphone5:w-full
    items-center border  border-[#444444]  bg-gradient-to-r from-[#000000] via-[#050505] via-50% to-[#181818] rounded-[3rem] xl:rounded-[7rem] p-2 xl:p-12 gap-3 xl:gap-10 font-NotoSansDisplay"
    >
      <img
        src={`${props.imgBase}${props.memory.image_path}`}
        className="xl:w-[200px] w-[120px] xl:h-[180px] h-[120px] object-cover xl:mb-10 xl:mt-6 xl:rounded-[3rem] rounded-[2rem] custom-shadow-image"
      />

      <div className="flex flex-row gap-1 xl:gap-3 -mb-[36px] p-3">
        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <QuotationMarks></QuotationMarks>
            <InfoMemorySubject></InfoMemorySubject>
          </div>
          <div className="h-[1px] bg-[#444444]"></div>
          <InfoMemoryCardDescription
            description={props.memory.description}
          ></InfoMemoryCardDescription>
          <div className="h-[1px] bg-[#444444]"></div>
          <div className="relative flex justify-center iphone5:justify-end mt-2 ">
            <InfoMemoryCardButton
              timestamp={props.memory.timestamp}
            ></InfoMemoryCardButton>
          </div>
        </div>
      </div>
    </div>
  );
}
