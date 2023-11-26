import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: any
    api: any
    myShell: any
  }
}
