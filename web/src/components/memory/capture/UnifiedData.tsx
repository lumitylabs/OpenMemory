import { LogMicrofone } from "./LogMicrofone";
import { LogImage } from "./LogImage";
import { LogSystemAudio } from "./LogSystemAudio";

export const ChatHeader = () => (
  <div className="  mt-4 flex">
    <div className="w-full xl:w-[1000px] h-[1px] bg-[#444444] xl:ml-[84px] ml-[30px]">
      <div className="font-Sarabun text-[4rem] absolute xl:-mt-11 -mt-10 -ml-8 xl:-ml-9 text-[#4A4A4A] select-none">
        “
      </div>
    </div>
  </div>
);

export const ChatBottom = () => (
  <div className="xl:w-[1000px] h-[1px] bg-[#444444] xl:ml-[84px] ml-[30px] mb-4"></div>
);

export const UnifiedData = ({
  data,
  imgBase,
}: {
  data: any[];
  imgBase: string;
}) => (
  <div>
    {data &&
      data.map((item, idx) => {
        const isAudioMicrofone =
          item.datatype === "audio" && item.type == "microfone";
        const isPrevAudioMicrofone =
          idx > 0 &&
          data[idx - 1].datatype === "audio" &&
          data[idx - 1].type === "microfone";
        const isNextAudioMicrofone =
          idx < data.length - 1 &&
          data[idx + 1].datatype === "audio" &&
          data[idx + 1].type === "microfone";

        return item.datatype === "audio" ? (
          item.type == "microfone" ? (
            <LogMicrofone
              isAudioMicrofone={isAudioMicrofone}
              isPrevAudioMicrofone={isPrevAudioMicrofone}
              isNextAudioMicrofone={isNextAudioMicrofone}
              item={item}
            ></LogMicrofone>
          ) : (
            <LogSystemAudio item={item}></LogSystemAudio>
          )
        ) : (
          <LogImage item={item} idx={idx} imgBase={imgBase}></LogImage>
        );
      })}
  </div>
);
