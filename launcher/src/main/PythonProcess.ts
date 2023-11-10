import { spawn } from 'child_process';
import { deviceStatus, deviceCapture, mainWindow} from '.';

export const startPythonProcess = (device, path) => {
  deviceStatus[device] = true;
  deviceCapture[device] = spawn('python', [path]);
  mainWindow.webContents.send('status-update', device, true);

  deviceCapture[device].stdout.on('data', (data) => {
    console.log(`${device} stdout: ${data}`);
  });

  deviceCapture[device].stderr.on('data', (data) => {
    console.error(`${device} stderr: ${data}`);
    deviceStatus[device] = false;
    mainWindow.webContents.send('status-update', device, false);
  });

  deviceCapture[device].on('close', (code) => {
    console.log(`${device} process ended with code: ${code}`);
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
