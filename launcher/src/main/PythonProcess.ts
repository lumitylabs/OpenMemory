import { spawn } from 'child_process';
import { deviceStatus, deviceCapture, mainWindow, python_env} from '.';
import fs from 'fs'
const logFile = 'logs.log';

function logToFile(message) {
  fs.appendFileSync(logFile, `${new Date().toISOString()}: ${message}\n`);
}


export const startPythonProcess = (device, path) => {

    deviceStatus[device] = true;
    deviceCapture[device] = spawn(python_env, [path]);
    mainWindow.webContents.send('status-update', device, true);
  
    deviceCapture[device].stdout.on('data', (data) => {
      logToFile(`${device} stdout: ${data}`);
    });
  
    deviceCapture[device].stderr.on('data', (data) => {
      logToFile(`${device} stderr: ${data}`);
      deviceStatus[device] = false;
      mainWindow.webContents.send('status-update', device, false);

    });
  
    deviceCapture[device].on('close', (code) => {
      logToFile(`${device} process ended with code: ${code}`);
      deviceStatus[device] = false;
      mainWindow.webContents.send('status-update', device, false);
  
    });
  
  
};
export const stopPythonProcess = (device) => {
  if (deviceCapture[device]) {
    deviceCapture[device].kill();
    deviceCapture[device] = null;
    deviceStatus[device] = false;
    mainWindow.webContents.send('status-update', device, false);

  }
};
