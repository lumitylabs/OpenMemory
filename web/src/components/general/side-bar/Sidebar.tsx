import { useState } from "react";
import { SideLogo } from "./SideLogo";
import { AddMemoriesButton } from "./AddMemoriesButton";
import { ImportSideButton } from "./ImportSideButton";
import { SideSearchInput } from "./InputSideSearch";
import MemoryList from "./MemoryList";
import { ToggleCapture } from "./ToggleCapture";
import Divider from "./Divider";
import SwitchGroup from "./SwitchGroup";
import CaptureButton from "./CaptureButton";
import ProcessButton from "./ProcessButton";

type SwitchStateKeys = "microphone" | "systemAudio" | "captureScreens";

const Sidebar: React.FC = () => {
  const [switchStates, setSwitchStates] = useState<{
    [key in SwitchStateKeys]: boolean;
  }>({
    microphone: false,
    systemAudio: false,
    captureScreens: false,
  });

  const handleSwitchChange = (id: SwitchStateKeys) => {
    setSwitchStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-[450px] p-9 bg-gradient-to-r from-[#458CAA] to-[#AF92AC] overflow-y-auto z-10">
      <div className="flex flex-col gap-9">
        <SideLogo />
        <div className="flex w-full gap-2">
          <SideSearchInput />
          <AddMemoriesButton />
          <ImportSideButton />
        </div>
      </div>
      <MemoryList memories={["Memória Um", "Memória Dois", "Memória Três"]} />
      <Divider classParameters="border-white border-opacity-10 mt-5 mb-9" />
      <div className="flex flex-col gap-5">
        <ToggleCapture />
        <SwitchGroup
          id="microphone"
          label="Microphone"
          checked={switchStates.microphone}
          onToggle={handleSwitchChange}
        />
        <SwitchGroup
          id="systemAudio"
          label="System Audio"
          checked={switchStates.systemAudio}
          onToggle={handleSwitchChange}
        />
        <SwitchGroup
          id="captureScreens"
          label="Capture Screens"
          checked={switchStates.captureScreens}
          onToggle={handleSwitchChange}
        />
      </div>

      <Divider classParameters="border-white border-opacity-10 my-9" />

      <div className="flex justify-end gap-5">
        <ProcessButton></ProcessButton>
        <CaptureButton></CaptureButton>
      </div>
    </div>
  );
};

export default Sidebar;
