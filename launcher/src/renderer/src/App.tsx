import './index.css'

import { useState } from 'react'
import MulticolorComponent from './components/manager/MulticolorComponent'

const KeyBG = (props: { text: string }) => {
  return (
    <div className="inline-flex items-center bg-[#A0A8AA] rounded-md p-[1px] pl-2 pr-2 text-[12px]">
      {props.text}
    </div>
  )
}

const Switch = ({ isOn, handleToggle }) => {
  return (
    <div
      className={`w-11 h-[24px] flex items-center rounded-full pl-[2px] pr-[1px] cursor-pointer transition-colors duration-300 ease-in-out ${
        isOn ? 'bg-[#D458C8]' : 'bg-[#C6C6C6]'
      }`}
      onClick={handleToggle}
    >
      <div
        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isOn ? 'translate-x-5' : 'translate-x-0'
        }`}
      ></div>
    </div>
  )
}

const SensorsWidget = () => {
  const [micActive, setMicActive] = useState(false)
  const [systemAudioActive, setSystemAudioActive] = useState(false)
  const [screenCaptureActive, setScreenCaptureActive] = useState(false)
  return (
    <div className="flex flex-col mt-4 gap-4">
      <div className="flex justify-between items-center">
        <div>Microphone</div>
        <Switch isOn={micActive} handleToggle={() => setMicActive(!micActive)} />
      </div>
      <div className="flex justify-between items-center">
        <div>System Audio</div>
        <Switch
          isOn={systemAudioActive}
          handleToggle={() => setSystemAudioActive(!systemAudioActive)}
        />
      </div>
      <div className="flex justify-between items-center">
        <div>Screen Capture</div>
        <Switch
          isOn={screenCaptureActive}
          handleToggle={() => setScreenCaptureActive(!screenCaptureActive)}
        />
      </div>
    </div>
  )
}

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

function App() {
  const handleMinimize = () => {
    window.api.send('minimize-app', {})
  }

  const handleClose = () => {
    window.api.send('close-app', {})
  }

  return (
    <div className="flex justify-center flex-col">
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
          Default Memory
        </div>
        <div className="flex justify-between mt-7">
          <div className="text-[16px] p-[4px] pl-6 pr-6 border-2 border-[#454545] rounded-2xl inline-flex items-center text-center select-none cursor-pointer">
            Process All
          </div>
          <div className="text-[16px] p-2 pl-8 pr-8 bg-[#D458C8] rounded-2xl inline-flex gap-2 items-center text-center select-none cursor-pointer">
          <MulticolorComponent
        name="Playlogo"
        baseColor=""
        selectedColor=""
        isSelected
        classParameters=""
      />Capture
          </div>
        </div>
        <div className="mt-7 ml-2 mr-2 select-none">
          <ToggleCapture></ToggleCapture>
          <SensorsWidget></SensorsWidget>
        </div>
      </div>
      <div className="flex justify-center mt-8 ">
        <button className="text-white font-semibold py-3 px-5 rounded-2xl w-full mx-7 magicbutton">
          My Memories
        </button>
      </div>
    </div>
  )
}

export default App
