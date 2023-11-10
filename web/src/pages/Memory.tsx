import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatUI from "../components/general/ChatUI";
import { Tags } from "../components/memory/Tags";
import { Reminders } from "../components/memory/Reminders";
import useMemoryData from "../controllers/useMemoryData";
import { getUnifiedData } from "../hooks/getUnifiedData";
import { UnifiedData } from "../components/memory/log/UnifiedData";
import { IMG_BASE } from "../repository/routes";

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
  const updatedTags = tags ? tags.split(";") : [];
  const updatedReminders = reminders ? reminders.split(";") : [];
  const unifiedData = getUnifiedData(data);
  return (
    <div className="flex flex-col">
      <Navbar />

      <div className="flex">
        <div className="flex flex-col mt-32 font-NotoSansDisplay md:w-3/4 w-full">
          <div className="p-2 xl:p-12 text-[#636363]">
            <div
              className="cursor-pointer select-none"
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Return to Memories
            </div>
            <div className="bg-[#252525] p-9 rounded-2xl mt-12 flex justify-between flex-wrap xl:flex-nowrap">
              <div className="xl:w-[700px]">
                <div className="text-[#909090]">{formatDate(timestamp)}</div>
                <div className="text-[#4AB7E5] text-3xl font-semibold">
                  {title}
                </div>
                <div className="mt-3 text-[#A4A4A4]">{description}</div>
                <div className="mt-6">
                  <Tags tags={updatedTags} />
                </div>
              </div>
              <div className="">
                <Reminders reminders={updatedReminders} />
              </div>
            </div>
          </div>
          <div className="xl:ml-20">
          <UnifiedData data={unifiedData} imgBase={IMG_BASE} />
          </div>
        </div>
        <div className="fixed right-0 top-0 h-screen md:inline-block hidden overflow-y-auto md:w-1/4">
          <ChatUI></ChatUI>
        </div>
      </div>
    </div>
  );
}

export default Memory;
