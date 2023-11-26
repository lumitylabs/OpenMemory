import { useEffect, useState } from "react";
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
import { useMemories } from "../../../hooks/useMemories";
import { useLoadConfig } from "../../../hooks/useLoadConfig";
import { useSetSensor } from "../../../hooks/useSetSensor";
import { useGetCaptureState } from "../../../hooks/useGetCaptureState";

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
    setSwitchStates((prev) => {
      const newState = { ...prev, [id]: !prev[id] };

      const sensorNameMap = {
        systemAudio: "system_audio_capture",
        microphone: "microphone_audio_capture",
        captureScreens: "screenshot_capture",
      };
      const sensorName = sensorNameMap[id];

      useSetSensor({ "sensor_name": sensorName, "state": newState[id] })
        .catch((error) => {
          console.error("Error setting sensor state:", error);
        });

      return newState;
    });
  };



  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  useEffect(() => {
    useMemories()
      .then((data) => {
        setMemories(data);
      })
      .catch((error) => {
        console.error("Error loading memories:", error);
      });

      useLoadConfig()
      .then((config) => {
        setSelectedMemory(config.selected_memory);
        const switchMapping:any = {
          systemAudio: "system_audio_capture",
          microphone: "microphone_audio_capture",
          captureScreens: "screenshot_capture",
        };
        const newSwitchStates = Object.keys(switchMapping).reduce((acc:any, key:any) => {
          acc[key] = config.sensors[switchMapping[key]];
          return acc;
        }, {});
        setSwitchStates(newSwitchStates);
      })
      .catch((error) => {
        console.error("Error loading config:", error);
      });

      useGetCaptureState()
      .then((captureState) => {
        setIsCapturing(captureState['state'])
      })
  }, []);


  

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
      <MemoryList memories={memories} selectedMemory={selectedMemory} />
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
        <CaptureButton isActive={isCapturing} setIsActive={setIsCapturing}></CaptureButton>
      </div>
    </div>
  );
};

export default Sidebar;
