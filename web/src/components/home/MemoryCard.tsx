import React from "react";
import { Tags } from "../memory/Tags";
import { Reminders } from "../memory/Reminders";
import { Timestamp } from "../memory/Timestamp";
import { Header } from "../memory/Header";
import { Description } from "../memory/Description";
import { Image } from "../memory/Image";

interface MemoryCardProps {
  title: string;
  description: string;
  tags?: string;
  reminders?: string;
  timestamp: string;
  image_path: string;
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  title,
  description,
  tags,
  reminders,
  timestamp,
  image_path,
}) => {
  var imgBase = "http://localhost:8000/screencaptures/";
  const updatedTags = tags ? tags.split(";") : [];
  const updatedReminders = reminders ? reminders.split(";") : [];

  return (
    <div
      className=" font-Saira 2xl:w-[1200px] lg:w-[700px] md:w-[500px] w-[500px] cursor-pointer"
      onClick={() => {
        window.location.href = "/memory/" + timestamp;
      }}
    >
      <div className="border-0 p-14 xl:pl-32 xl:pr-32 mb-12 rounded-3xl bg-[#232222]">
        <Timestamp timestamp={timestamp} />
        <Header title={title} />
        <Description description={description} />
        <Tags tags={updatedTags} />
        <Image src={`${imgBase}${image_path}`} alt={title} />
        <Reminders reminders={updatedReminders}></Reminders>
      </div>
    </div>
  );
};

export default MemoryCard;
