import './index.css'

import { useEffect, useState } from 'react'
import MulticolorComponent from './components/manager/MulticolorComponent'
import { DeviceContext } from './DeviceContext'
import { useContext } from 'react'
import axios from 'axios'


const KeyBG = (props: { text: string }) => {
  return (
    <div className="inline-flex items-center bg-[#A0A8AA] rounded-md p-[1px] pl-2 pr-2 text-[12px]">
      {props.text}
    </div>
  )
}

const Switch = ({ isOn, handleToggle, name }) => {
  const toggleSensor = () => {
    handleToggle()
    axios.post('http://localhost:8000/set_sensor', {
      sensor_name: name,
      state: !isOn
    })
  }

  return (
    <div
      className={`w-11 h-[24px] flex items-center rounded-full pl-[2px] pr-[1px] cursor-pointer transition-colors duration-300 ease-in-out ${
        isOn ? 'bg-[#D458C8]' : 'bg-[#C6C6C6]'
      }`}
      onClick={toggleSensor}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isOn ? 'translate-x-5' : 'translate-x-0'
        }`}
      ></div>
    </div>
  )
}

const SensorsWidget = ({ 
  micActive, 
  setMicActive, 
  systemAudioActive, 
  setSystemAudioActive, 
  screenCaptureActive, 
  setScreenCaptureActive 
}) => {
  useEffect(() => {
    axios.get('http://localhost:8000/load_config').then((response) => {
      const sensors = response.data.sensors
      setMicActive(sensors.microphone_audio_capture)
      setSystemAudioActive(sensors.system_audio_capture)
      setScreenCaptureActive(sensors.screenshot_capture)
    })
  }, [])

  return (
    <div className="flex flex-col mt-4 gap-4">
      <div className="flex justify-between items-center">
        <div>Microphone</div>
        <Switch
          isOn={micActive}
          handleToggle={() => setMicActive(!micActive)}
          name="microphone_audio_capture"
        />
      </div>
      <div className="flex justify-between items-center">
        <div>System Audio</div>
        <Switch
          isOn={systemAudioActive}
          handleToggle={() => setSystemAudioActive(!systemAudioActive)}
          name="system_audio_capture"
        />
      </div>
      <div className="flex justify-between items-center">
        <div>Screen Capture</div>
        <Switch
          isOn={screenCaptureActive}
          handleToggle={() => setScreenCaptureActive(!screenCaptureActive)}
          name="screenshot_capture"
        />
      </div>
    </div>
  );
};

function ToggleCapture() {
  return (
    <div className="flex justify-between">
      <div>Toggle Capture</div>
      <div className="flex gap-1">
        <KeyBG text="CTRL" />
        <KeyBG text="SHIFT" />
        <KeyBG text="P" />
      </div>
    </div>
  )
}

function Title() {
  return (
    <div className="text-[30px] mb-7 flex gap-3 items-center">
      <MulticolorComponent
        name="Omlogo"
        baseColor=""
        selectedColor=""
        isSelected
        classParameters=""
      />
      Open Memory
    </div>
  )
}
const handleMinimize = () => {
  window.api.send('minimize-app', {})
}

const handleClose = () => {
  window.api.send('close-app', {})
}

const Application = () => {
  const [memoryName, setMemoryName] = useState('Default Memory')
  const [processing, setProcessing] = useState(false)
  const [capturing, setCapturing] = useState(false)
  const [micActive, setMicActive] = useState(false);
  const [systemAudioActive, setSystemAudioActive] = useState(false);
  const [screenCaptureActive, setScreenCaptureActive] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.function) {
        case "select_memory":
          setMemoryName(data.name);
          break;
        case "processing_start":
          setProcessing(true);
          break;
        case "processing_done":
          setProcessing(false);
          break;
        case "start_capture":
          setCapturing(true);
          break;
        case "stop_capture":
          setCapturing(false);
          break;
        case "set_sensor":
          const sensorNameMap = {
            system_audio_capture: "systemAudioActive",
            microphone_audio_capture: "micActive",
            screenshot_capture: "screenCaptureActive",
          };
          const stateKey = sensorNameMap[data.sensor_name];

          if (stateKey) {
            if (stateKey === "micActive") setMicActive(data.state);
            else if (stateKey === "systemAudioActive") setSystemAudioActive(data.state);
            else if (stateKey === "screenCaptureActive") setScreenCaptureActive(data.state);
          } else {
            console.warn("Received unknown sensor name:", data.sensor_name);
          }
          break;
        default:
          break;
      }
    };

    return () => ws.close();
  }, []);


  useEffect(() => {
    axios.get('http://localhost:8000/load_config').then((response) => {
      const memory = response.data.selected_memory
      setMemoryName(memory.name)
    })
  }, [])

  const handleProcessAll = () => {
    setProcessing(true)
    axios.post('http://localhost:8000/process_all').then(() => {
      setProcessing(false)
    })
  }

  const handleCapture = () => {
    setCapturing(!capturing);
    if (!capturing) {
      axios.post('http://localhost:8000/start_capture');
    } else {
      axios.post('http://localhost:8000/stop_capture');
    }
  };

  const { startWebServer, webServerUpdate, isCapturing  } = useContext(DeviceContext)
  const isRunning = (webServerUpdate === '' || webServerUpdate === 'Done') ? false : true
  useEffect(() => {
    console.log('isCapturing', isCapturing)
    if(isCapturing){
      window.api.send('toggle-capture', {})
      handleCapture();
    }
    
    
  }, [isCapturing]);

  return (
    <div>
      <div id="title-bar" className="text-[#FFFFFF] flex flex-col select-none">
        <div className="w-full flex justify-end">
          <div
            id="window-controls"
            className="inline-flex items-center justify-end mt-2 mr-2 w-fit"
          >
            <div className="button select-none" onClick={handleMinimize}>
              -
            </div>
            <div className="button select-none" onClick={handleClose}>
              x
            </div>
          </div>
        </div>
        <div className="ml-7">
          <Title></Title>
        </div>
      </div>
      <div className="text-[#FFFFFF] ml-7 mr-7 font-Mada font-semibold text-[16px]">
        <div className="bg-[#171717] p-3 rounded-lg flex items-center text-[16px] select-none">
          {memoryName}
        </div>
        <div className="flex justify-between mt-7">
          <div
            className={`text-[16px] p-[4px] pl-6 pr-6 border-2 border-[#454545] rounded-2xl inline-flex items-center text-center select-none cursor-pointer ${
              processing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => {
              !processing ? handleProcessAll() : null
            }}
          >
            {processing ? (
              <div className='flex gap-2 items-center'>
                <div>Processing</div>
                <SpinAnimation height={12} width={12} />
              </div>
            ) : (
              'Process All'
            )}
          </div>
          <div
            className="text-[16px] p-2 pl-8 pr-8 bg-[#D458C8] rounded-2xl inline-flex gap-2 items-center text-center select-none cursor-pointer"
            onClick={handleCapture}
          >
            <MulticolorComponent
              name="Playlogo"
              baseColor=""
              selectedColor=""
              isSelected
              classParameters=""
            />
            {capturing ? 'Stop' : 'Capture'}
          </div>
        </div>
        <div className="mt-7 ml-2 mr-2 select-none">
          <ToggleCapture />
          <SensorsWidget
          micActive={micActive}
          systemAudioActive={systemAudioActive}
          screenCaptureActive={screenCaptureActive}

          setMicActive={setMicActive}
          setSystemAudioActive={setSystemAudioActive}
          setScreenCaptureActive={setScreenCaptureActive}/>
        </div>
      </div>
      <div className="flex justify-center mt-8 ">
        <button className="text-white font-semibold py-3 px-5 rounded-2xl w-full mx-7 magicbutton"
        onClick={isRunning ? () => {} : () => startWebServer()}
        style={{ cursor: isRunning ? 'default' : 'pointer'}}>
          My Memories
        </button>
      </div>
    </div>
  )
}

function SpinAnimation(props: { height: number; width: number }) {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      role="status"
      style={{ height: props.height, width: props.width }}
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  )
}

const Loading = () => {
  return (
    <div id="title-bar" className="text-[#FFFFFF] flex flex-col select-none h-screen">
      <div className="w-full flex justify-end">
        <div id="window-controls" className="inline-flex items-center justify-end mt-2 mr-2 w-fit">
          <div className="button select-none z-20" onClick={handleMinimize}>
            -
          </div>
          <div className="button select-none z-20" onClick={handleClose}>
            x
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center absolute h-full w-full flex-col">
        <Title />
        <SpinAnimation width={32} height={32} />
      </div>
      <div className="h-screen w-full">
        <div className="flex bottom-0 mb-4 items-center justify-center absolute flex-col w-full">
          Starting server...
        </div>
      </div>
    </div>
  )
}

function App() {
  const { dataServerUpdate } = useContext(DeviceContext)
  const isRunning = dataServerUpdate === 'done' ? true : false

  return (
    <div className="flex justify-center flex-col text-white">
      {isRunning ? <Application /> : <Loading />}
    </div>
  )
}

export default App
