import { app, shell, BrowserWindow, globalShortcut } from 'electron'

import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { ipcMain } from 'electron';
import { startPythonProcess, stopPythonProcess } from './PythonProcess';
import { processData } from './processData';
import { runWebServer } from './runWebServer';
import { runDataServer } from './startDataServer';
var isWebServerRunning = false
export var deviceCapture = {};
export var deviceStatus = {};
export let mainWindow: BrowserWindow;
export const devices = ['record_microfone', 'record_system', 'record_screenshot'];
export let python_env = "python_embedding/python.exe"
var processes = <any>[];

export function addProcess(process:any){
  processes.push(process);
}

export function getServerRunning(){
  return isWebServerRunning;
}
export function setServerRunning(value:boolean){
  isWebServerRunning = value;
}

function stopServer() {
  for (let i = 0; i < processes.length; i++) {
    try{
      processes[i].kill('SIGINT');
    }
    catch{
      
    }
  }
}

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 350,
    height: 520,
    show: false,
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    icon: icon,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      contextIsolation: true,
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  
  ipcMain.on('minimize-app', () => {
    console.log("minimize-app")
    mainWindow.minimize();
  });

  ipcMain.on('toggle-capture', () => {
    mainWindow.webContents.send('toggle-capture')
  });
  
  ipcMain.on('close-app', () => {
    mainWindow.close();
  });

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

  ipcMain.on('process-data', () => {
    processData();
  });

  ipcMain.on('start-data-server', () => {
    runDataServer();
  });

  ipcMain.on('start-web-server', () => {
    runWebServer();
  });


  

  mainWindow.on('ready-to-show', () => {
    
    mainWindow.show()
    runDataServer();
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

app.on('before-quit', stopServer);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    globalShortcut.unregisterAll()
    stopServer();
    app.quit()
  }
})
