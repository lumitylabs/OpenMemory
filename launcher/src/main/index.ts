import { app, shell, BrowserWindow } from 'electron'
import { exec } from 'child_process';
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { runDevice } from './runDevice';
import { ipcMain } from 'electron';
import { startPythonProcess, stopPythonProcess } from './PythonProcess';
import { processData } from './processData';

export var deviceCapture = {};
export var deviceStatus = {};
export let mainWindow: BrowserWindow;
export const devices = ['record_microfone', 'record_system', 'record_screenshot'];



function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 350,
    height: 400,
    show: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  
  ipcMain.on('start-device', (event, device, path) => {
    mainWindow.setTitle("DONE")
    startPythonProcess(device, path);
    console.log("start-device" + device)
    event.reply('status-update', device, deviceStatus[device]);
  });
  
  ipcMain.on('stop-device', (event, device) => {
    console.log("stop-device" + device)
    stopPythonProcess(device);
    event.reply('status-update', device, deviceStatus[device]);
  });

  ipcMain.on('process-data', (event) => {
    processData();
  });


  mainWindow.on('ready-to-show', () => {
    runDevice('record_microfone', '../client/sensors/microphone_audio_capture.py');
    runDevice('record_system', '../client/sensors/system_audio_capture.py');
    runDevice('record_screenshot', '../client/sensors/screenshot_capture.py');
    

    mainWindow.show()
    
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)

  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  
})

app.whenReady().then(() => {

  

});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
