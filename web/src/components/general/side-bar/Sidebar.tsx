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
import { useGetIsProcessing } from "../../../hooks/useGetIsProcessing";
import { useImportMemory } from "../../../hooks/useImportMemory";

type SwitchStateKeys = "microphone" | "systemAudio" | "captureScreens";

interface SidebarProps {
  forceReloadMemories: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ forceReloadMemories }) => {
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

      useSetSensor({ sensor_name: sensorName, state: newState[id] }).catch(
        (error) => {
          console.error("Error setting sensor state:", error);
        }
      );

      return newState;
    });
  };

  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState(false);

  function refreshMemories() {
    useMemories()
      .then((data) => {
        setMemories(data);
        forceReloadMemories();
      })
      .catch((error) => {
        console.error("Error loading memories:", error);
      });
  }

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
        const switchMapping: any = {
          systemAudio: "system_audio_capture",
          microphone: "microphone_audio_capture",
          captureScreens: "screenshot_capture",
        };
        const newSwitchStates = Object.keys(switchMapping).reduce(
          (acc: any, key: any) => {
            acc[key] = config.sensors[switchMapping[key]];
            return acc;
          },
          {}
        );
        setSwitchStates(newSwitchStates);
      })
      .catch((error) => {
        console.error("Error loading config:", error);
      });

    useGetCaptureState().then((captureState) => {
      setIsCapturing(captureState["state"]);
    });

    useGetIsProcessing().then((processingState) => {
      setIsProcessing(processingState["state"]);
    });
  }, []);

  useEffect(() => {
    const ws: any = new WebSocket("ws://127.0.0.1:8000/ws");
    ws.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      if (data.function == "processing_start") {
        setIsProcessing(true);
      }
      if (data.function == "processing_done") {
        setIsProcessing(false);
      }
      if (data.function == "start_capture") {
        setIsCapturing(true);
      }
      if (data.function == "stop_capture") {
        setIsCapturing(false);
      }
      if (data.function === "set_sensor") {
        const sensorNameMap: any = {
          system_audio_capture: "systemAudio",
          microphone_audio_capture: "microphone",
          screenshot_capture: "captureScreens",
        };
        const stateKey = sensorNameMap[data.sensor_name];

        if (stateKey) {
          setSwitchStates((prev) => {
            const newState = { ...prev, [stateKey]: data.state };
            return newState;
          });
        } else {
          console.warn("Received unknown sensor name:", data.sensor_name);
        }
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleFileSelected = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsImporting(true);
      await useImportMemory(formData);
      setIsImporting(false);
      refreshMemories();
    } catch (error) {
      console.error("Error importing memory:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-[450px] p-9 bg-gradient-to-r from-[#458CAA] to-[#AF92AC] overflow-y-auto z-10">
      <div className="flex flex-col gap-9">
        <SideLogo />
        <div className="flex w-full gap-2">
          <SideSearchInput />
          <AddMemoriesButton refreshMemories={refreshMemories} />

          <ImportSideButton onFileSelected={handleFileSelected} />
        </div>
      </div>
      <MemoryList
        memories={memories}
        selectedMemory={selectedMemory}
        refreshMemories={refreshMemories}
        isImporting={isImporting}
        isCapturing={isCapturing}
      />
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
        <ProcessButton
          isActive={isProcessing}
          setIsActive={setIsProcessing}
        ></ProcessButton>
        <CaptureButton
          isActive={isCapturing}
          setIsActive={setIsCapturing}
        ></CaptureButton>
      </div>
    </div>
  );
};

export default Sidebar;
