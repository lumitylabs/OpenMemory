import React, { createContext, useState, useEffect } from 'react';

const { startDevice, stopDevice, onStatusUpdate, removeStatusUpdateListener } = window.electron;

interface DeviceContextType {
  deviceStatus: { [device: string]: boolean };
  startDevice: (device: string, path: string) => void;
  stopDevice: (device: string) => void;
}


export const DeviceContext = createContext<DeviceContextType>({
  deviceStatus: {},
  startDevice: () => {
    throw new Error('startDevice function must be overridden');
  },
  stopDevice: () => {
    throw new Error('stopDevice function must be overridden');
  },
});

export const DeviceProvider = ({ children }) => {
  const [deviceStatus, setDeviceStatus] = useState({});

  useEffect(() => {
    const updateStatus = (event, device, status) => {
      setDeviceStatus(prev => ({...prev, [device]: status}));
    };

    onStatusUpdate(updateStatus);

    return () => {
      removeStatusUpdateListener();
    }
  }, []);


  return (
    <DeviceContext.Provider value={{ deviceStatus, startDevice, stopDevice }}>
      {children}
    </DeviceContext.Provider>
  );
};