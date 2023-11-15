import { contextBridge, ipcRenderer, shell } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}


// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      startDevice: (device, path) => ipcRenderer.send('start-device', device, path),
      processData: () => ipcRenderer.send('process-data'),
      startWebServer: () => ipcRenderer.send('start-web-server'),
      stopDevice: (device) => ipcRenderer.send('stop-device', device),
      onStatusUpdate: (callback) => ipcRenderer.on('status-update', callback),
      onProcessDataUpdate: (callback) => ipcRenderer.on('process-data-update', callback),
      onWebServerUpdate: (callback) => ipcRenderer.on('web-server-update', callback),
      removeStatusUpdateListener: () => ipcRenderer.removeAllListeners('status-update'),
      removeProcessDataUpdateListener: () => ipcRenderer.removeAllListeners('process-data-update'),
      removeWebServerUpdateListener: () => ipcRenderer.removeAllListeners('web-server-update')
    });
    contextBridge.exposeInMainWorld('api', api)
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