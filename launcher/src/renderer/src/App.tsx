import './index.css'
import { DeviceContext } from './DeviceContext'
import { useContext } from 'react'

function SensorStatus(props: { name: any; status: any }) {
  const statusColor = props.status === true ? 'text-[#4AB7E5]' : 'text-[#D458C8]'
  return (
    <div className="font-NotoSansDisplay text-sm">
      <div className="text-[#FFFFFF]">{props.name}</div>
      <div className={statusColor}>{props.status ? 'ACTIVE' : 'DISABLED'}</div>
    </div>
  )
}

const openMemories = () => {}

function ViewMemoriesButton() {
  return (
    <div
      className="text-xs bg-gradient-to-r from-[#C75CCB] to-[#5378D6] text-white p-2 pl-3 pr-3 rounded-full inline-flex justify-center items-center h-[40px] cursor-pointer select-none"
      onClick={openMemories}
    >
      VIEW MEMORIES
    </div>
  )
}


function Sensors() {
  const { deviceStatus } = useContext(DeviceContext)

  return (
    <div className="flex flex-col gap-2">
      <SensorStatus
        name="Recording Microfone"
        status={deviceStatus['record_microfone']}
      ></SensorStatus>
      <SensorStatus name="Recording System" status={deviceStatus['record_system']}></SensorStatus>
      <SensorStatus
        name="Recording Screenshot"
        status={deviceStatus['record_screenshot']}
      ></SensorStatus>
    </div>
  )
}

function ProcessingStatus(props: { type: string; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-[#D458C8] w-[5px] h-[5px] rounded-full"></div>
      <div className="text-[#9E949D]">
        {props.count} {props.type}
      </div>
    </div>
  )
}

function PendingProcessing() {
  return (
    <div className="flex flex-col gap-1">
      <div className="text-white">Pending Processing</div>
      <div>
        <ProcessingStatus type="Audios" count={101}></ProcessingStatus>
        <ProcessingStatus type="Screenshots" count={101}></ProcessingStatus>
        <ProcessingStatus type="Audio Transcriptions" count={101}></ProcessingStatus>
        <ProcessingStatus type="Entries on Vector DB" count={101}></ProcessingStatus>
      </div>
    </div>
  )
}

function UpdateMemories() {
  const { processData, processDataUpdate } = useContext(DeviceContext)
  const isUpdating = (processDataUpdate === '' || processDataUpdate === 'Done') ? false : true
  console.log(isUpdating)
  return (
    <div
      className={`text-xs ${
        isUpdating ? 'bg-[#818181]' : 'bg-[#D458C8]'
      } text-white p-2 pl-3 pr-3 rounded-full inline-flex justify-center items-center h-[40px] ${
        isUpdating ? '' : 'cursor-pointer'
      }"`}
      style={{ cursor: isUpdating ? 'default' : 'pointer'}}
      onClick={isUpdating ? () => {} : () => processData()}
    >
      UPDATE MEMORIES
    </div>
  )
}

function LastProcessing() {
  const { processDataUpdate } = useContext(DeviceContext)
  return (
    <div className="">
      <div className="text-white">PROCESS MEMORY DATA</div>
      <div className="text-xs text-[#696969]">Last Update: 1 hour ago</div>
      <div className="text-xs text-[#696969]">{processDataUpdate}</div>
    </div>
  )
}

function App() {
  const { startDevice, stopDevice } = useContext(DeviceContext)

  return (
    <div className="flex flex-col p-4 gap-3 text-sm">
      <div className="flex items-center justify-between">
        <Sensors></Sensors>
        <ViewMemoriesButton></ViewMemoriesButton>
      </div>
      <div className="w-full h-[1px] bg-[#3A3A3A]"></div>
      <PendingProcessing></PendingProcessing>
      <div className="w-full h-[1px] bg-[#3A3A3A]"></div>
      <div className="flex justify-between">
        <LastProcessing></LastProcessing>
        <UpdateMemories></UpdateMemories>
      </div>
      <button
        onClick={() =>
          startDevice('record_microfone', '../client/sensors/microphone_audio_capture.py')
        }
      >
        Start Microphone
      </button>
      <button onClick={() => stopDevice('record_microfone')}>Stop Microphone</button>
    </div>
  )
}

export default App
