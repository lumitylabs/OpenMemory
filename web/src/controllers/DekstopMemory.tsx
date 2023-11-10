import React from "react";
import { InfoMemoryCard } from "../components/home/info-memory-card/InfoMemoryCard";

function DekstopMemory(props:{imgBase:string, memory:any}) {
  return (
    <>
      <div className="w-[100px] h-[1px] bg-[#444444]"></div>
      <InfoMemoryCard imgBase={props.imgBase} memory={props.memory}></InfoMemoryCard>
    </>
  );
}

export default DekstopMemory;
