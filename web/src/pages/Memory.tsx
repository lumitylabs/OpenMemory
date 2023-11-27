import { useParams } from "react-router-dom";
import { Tags } from "../components/memory/Tags";
import { Reminders } from "../components/memory/Reminders";
import useMemoryData from "../controllers/useMemoryData";
import { getUnifiedData } from "../hooks/getUnifiedData";
import { UnifiedData } from "../components/memory/capture/UnifiedData";
import { IMG_BASE } from "../repository/routes";
import Sidebar from "../components/general/side-bar/Sidebar";

function Memory() {
  const { memoryid } = useParams();

  if (!memoryid) {
    return <div>Error: Memory ID not found!</div>;
  }

  const { data, isLoading } = useMemoryData(memoryid);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const { title, description, tags, reminders, timestamp } = data.activity;
  const updatedTags = tags ? tags.split(", ") : [];
  const updatedReminders = reminders ? reminders.split(";") : [];
  const unifiedData = getUnifiedData(data);
  return (
    <div className="flex flex-col ml-[450px]">
      <Sidebar></Sidebar>
      <div className="flex justify-center">
        <div className="flex flex-col font-NotoSansDisplay">
          <div className=" text-[#636363]">
            <div
              className="cursor-pointer select-none mt-9"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Return to Memories
            </div>
            <div className="flex gap-9 mb-10">
              <div className="bg-[#000] w-min border border-[#444444] p-9 mt-9 rounded-[36px] flex justify-between flex-wrap xl:flex-nowrap">
                <div className="w-[650px]">
                  <div className="text-[#909090] font-Mada font-semibold tracking-tight">
                    {formatDate(timestamp)}
                  </div>
                  <div className="text-[#fff] font-Mada text-3xl font-semibold tracking-tight">
                    {title}
                  </div>
                  <div className="mt-3 text-[#797979] font-Mada font-semibold tracking-tight">
                    {description}
                  </div>
                  <div className="mt-6">
                    <Tags tags={updatedTags} />
                  </div>
                </div>
              </div>

              <div className="bg-[#000] w-min border border-[#444444] p-9 mt-9 rounded-2xl flex justify-between flex-wrap xl:flex-nowrap">
                <div className="xl:w-[240px]">
                  <Reminders reminders={updatedReminders} />
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <UnifiedData data={unifiedData} imgBase={IMG_BASE} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Memory;
