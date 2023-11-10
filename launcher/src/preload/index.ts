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
      stopDevice: (device) => ipcRenderer.send('stop-device', device),
      onStatusUpdate: (callback) => ipcRenderer.on('status-update', callback),
      removeStatusUpdateListener: () => ipcRenderer.removeAllListeners('status-update')
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
