import { globalShortcut } from 'electron'
import fs from 'fs'
import { startPythonProcess, stopPythonProcess } from './PythonProcess'
import { deviceStatus, deviceCapture, devices, mainWindow } from '.'
let devicesStopped = false;

export const runDevice = async (device, path) => {
  
  try {
    var config = {}
    fs.readFile('./config.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading config file.', err)
        return
      }
      config = JSON.parse(data)

      if (config[device]) {
        startPythonProcess(device, path)
      } else {
        console.log(`${device} is not active`)
        deviceStatus[device] = false
      }
      const stopShortcut = config['stop_shortcut'];

      globalShortcut.register(stopShortcut, () => {

        devices.forEach(device => {
          
          if (!devicesStopped) {
            stopPythonProcess(device);
          }
          else {
            startPythonProcess(device, path); 
          }
      
        });
      
        devicesStopped = !devicesStopped; // inverte o estado
      
      });
      
    })
  } catch (err) {
    console.error(`Error running device ${device}:`, err)
  }
}
