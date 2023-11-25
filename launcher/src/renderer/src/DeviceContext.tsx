import { createContext, useState, useEffect } from 'react'

const {
  startDevice,
  stopDevice,
  onStatusUpdate,
  removeStatusUpdateListener,
  processData,
  startWebServer,
  onProcessDataUpdate,
  onWebServerUpdate,
  onDataApiMessageUpdate,
  removeProcessDataUpdateListener,
  removeWebServerUpdateListener,
  removeDataApiMessageUpdateListener
} = window.electron

interface DeviceContextType {
  deviceStatus: { [device: string]: boolean }
  startDevice: (device: string, path: string) => void
  stopDevice: (device: string) => void
  processData: () => void
  startWebServer: () => void
  processDataUpdate: String
  webServerUpdate: String
  dataServerUpdate: String
}

export const DeviceContext = createContext<DeviceContextType>({
  deviceStatus: {},
  startDevice: () => {
    throw new Error('startDevice function must be overridden')
  },
  stopDevice: () => {
    throw new Error('stopDevice function must be overridden')
  },
  processData: () => {
    throw new Error('processData function must be overridden')
  },
  startWebServer: () => {
    throw new Error('processData function must be overridden')
  },
  processDataUpdate: '',
  webServerUpdate: '',
  dataServerUpdate: ''
})

export const DeviceProvider = ({ children }) => {
  const [deviceStatus, setDeviceStatus] = useState({})
  const [processDataUpdate, setProcessDataUpdate] = useState('')
  const [webServerUpdate, setWebServerUpdate] = useState('')
  const [dataServerUpdate, setDataServerUpdate] = useState('')

  useEffect(() => {
    const updateStatus = (_, device, status) => {
      setDeviceStatus((prev) => ({ ...prev, [device]: status }))
    }

    onStatusUpdate(updateStatus)

    return () => {
      removeStatusUpdateListener()
    }
  }, [])

  useEffect(() => {
    const updateStatus = (_, status) => {
      setProcessDataUpdate(status)
    }

    onProcessDataUpdate(updateStatus)

    return () => {
      removeProcessDataUpdateListener()
    }
  }, [])

  useEffect(() => {
    const updateStatus = (_, status) => {
      setWebServerUpdate(status)
    }

    onWebServerUpdate(updateStatus)

    return () => {
      removeWebServerUpdateListener()
    }
  }, [])

  useEffect(() => {
    const updateStatus = (_, status) => {
      setDataServerUpdate(status)
    }

    onDataApiMessageUpdate(updateStatus)

    return () => { 
      removeDataApiMessageUpdateListener()
    }
  }, [])

  return (
    <DeviceContext.Provider
      value={{
        deviceStatus,
        startDevice,
        stopDevice,
        processData,
        startWebServer,
        processDataUpdate,
        webServerUpdate,
        dataServerUpdate
      }}
    >
      {children}
    </DeviceContext.Provider>
  )
}
