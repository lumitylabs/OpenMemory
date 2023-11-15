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
  removeProcessDataUpdateListener,
  removeWebServerUpdateListener
} = window.electron

interface DeviceContextType {
  deviceStatus: { [device: string]: boolean }
  startDevice: (device: string, path: string) => void
  stopDevice: (device: string) => void
  processData: () => void
  startWebServer: () => void
  processDataUpdate: String
  webServerUpdate: String
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
  webServerUpdate: ''
})

export const DeviceProvider = ({ children }) => {
  const [deviceStatus, setDeviceStatus] = useState({})
  const [processDataUpdate, setProcessDataUpdate] = useState('')
  const [webServerUpdate, setWebServerUpdate] = useState('')

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

  return (
    <DeviceContext.Provider
      value={{
        deviceStatus,
        startDevice,
        stopDevice,
        processData,
        startWebServer,
        processDataUpdate,
        webServerUpdate
      }}
    >
      {children}
    </DeviceContext.Provider>
  )
}
