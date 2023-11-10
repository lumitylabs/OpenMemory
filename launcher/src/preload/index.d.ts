import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: any
    api: unknown
    myShell: any
  }
}
