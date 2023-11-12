import React, { createContext, useState, useEffect } from 'react';

const { startDevice, stopDevice, onStatusUpdate, removeStatusUpdateListener, processData, onProcessDataUpdate, removeProcessDataUpdateListener } = window.electron;

interface DeviceContextType {
  deviceStatus: { [device: string]: boolean };
  startDevice: (device: string, path: string) => void;
  stopDevice: (device: string) => void;
  processData: () => void;
  processDataUpdate: String;
}


export const DeviceContext = createContext<DeviceContextType>({
  deviceStatus: {},
  startDevice: () => {
    throw new Error('startDevice function must be overridden');
  },
  stopDevice: () => {
    throw new Error('stopDevice function must be overridden');
  },
  processData: () => {
    throw new Error('processData function must be overridden');
  },
  processDataUpdate: "",
});

export const DeviceProvider = ({ children }) => {
  const [deviceStatus, setDeviceStatus] = useState({});
  const [processDataUpdate, setProcessDataUpdate] = useState("");

  useEffect(() => {
    const updateStatus = (event, device, status) => {
      setDeviceStatus(prev => ({...prev, [device]: status}));
    };

    onStatusUpdate(updateStatus);

    return () => {
      removeStatusUpdateListener();
    }
  }, []);

  useEffect(() => {
    const updateStatus = (event, status) => {
      setProcessDataUpdate(status)
    };

    onProcessDataUpdate(updateStatus);

    return () => {
      removeProcessDataUpdateListener();
    }
  }, []);


  return (
    <DeviceContext.Provider value={{ deviceStatus, startDevice, stopDevice, processData, processDataUpdate}}>
      {children}
    </DeviceContext.Provider>
  );
};