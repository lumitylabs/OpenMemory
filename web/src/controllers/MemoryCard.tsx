import { useState } from "react";
import { BasicMemoryCard } from "../components/home/basic-memory-card/BasicMemoryCard";
import DekstopMemory from "./DekstopMemory";
import MobileMemory from "./MobileMemory";

export function MemoryCard(props: any) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div
      className={`flex items-center w-full ${props.isLargeScreen ? "" : "flex-col"}`}
    >
      <BasicMemoryCard memory={props.memory} idx={props.idx} showInfo={showInfo}></BasicMemoryCard>
      {props.isLargeScreen ? (
        <DekstopMemory
          imgBase={props.imgBase}
          memory={props.memory}
        ></DekstopMemory>
      ) : (
        <MobileMemory
          imgBase={props.imgBase}
          memory={props.memory}
          setShowInfo={setShowInfo}
          showInfo={showInfo}
        ></MobileMemory>
      )}
    </div>
  );
}
