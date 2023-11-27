import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer


// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      
      startDevice: (device, path) => ipcRenderer.send('start-device', device, path),
      processData: () => ipcRenderer.send('process-data'),
      startDataServer: () => ipcRenderer.send('start-data-server'),
      startWebServer: () => ipcRenderer.send('start-web-server'),
      stopDevice: (device) => ipcRenderer.send('stop-device', device),
      onStatusUpdate: (callback) => ipcRenderer.on('status-update', callback),
      onProcessDataUpdate: (callback) => ipcRenderer.on('process-data-update', callback),
      onWebServerUpdate: (callback) => ipcRenderer.on('web-server-update', callback),
      onDataApiMessageUpdate: (callback) => ipcRenderer.on('data-api-message', callback),
      onToggleCapture: (callback) => ipcRenderer.on('toggle-capture', callback),
      onQuitApplication: (callback) => ipcRenderer.on('quit-application', callback),
      removeQuitApplicationListener: () => ipcRenderer.removeAllListeners('quit-application'),
      removeToggleCaptureListener: () => ipcRenderer.removeAllListeners('toggle-capture'),
      removeStatusUpdateListener: () => ipcRenderer.removeAllListeners('status-update'),
      removeProcessDataUpdateListener: () => ipcRenderer.removeAllListeners('process-data-update'),
      removeWebServerUpdateListener: () => ipcRenderer.removeAllListeners('web-server-update'),
      removeDataApiMessageUpdateListener: () => ipcRenderer.removeAllListeners('data-api-message')
    });
    contextBridge.exposeInMainWorld('api', {
      send: (channel: string, data: any) => {
        console.log(channel, data)
        let validChannels = ['minimize-app', 'close-app', 'toggle-capture'];
        if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
        }
      },
    })
    contextBridge.exposeInMainWorld('myShell', shell)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}