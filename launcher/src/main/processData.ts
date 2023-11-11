import { globalShortcut } from 'electron'
import fs from 'fs'
import { startPythonProcess, stopPythonProcess } from './PythonProcess'
import { deviceStatus, deviceCapture, devices, mainWindow } from '.'
let devicesStopped = false
import { spawn } from 'child_process'

export const processData = async () => {
  try {
    let dataProcessor = spawn('python', ['../client/sensors/audio_processor.py'])

    dataProcessor.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });
    
      dataProcessor.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
    
      dataProcessor.on('close', (code) => {
        console.log(`process ended with code: ${code}`);

    
      });

  } catch (err) {
    console.log(err)
  }
}
