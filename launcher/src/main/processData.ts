import { globalShortcut } from 'electron'
import fs from 'fs'
import { startPythonProcess, stopPythonProcess } from './PythonProcess'
import { deviceStatus, deviceCapture, devices, mainWindow } from '.'
let devicesStopped = false
import { spawn } from 'child_process'
import { join } from 'path'

export const processData = async () => {
  try {
    await new Promise<void>((resolve, reject) => {
      let dataProcessor = spawn('python', ['../client/sensors/audio_processor.py']);

      dataProcessor.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      dataProcessor.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });

      dataProcessor.on('close', (code) => {
        console.log(`dataProcessor ended with code: ${code}`);
        resolve();
      });

      dataProcessor.on('error', (err) => {
        reject(err);
      });
    });

    let server = spawn('python', ['../llm_api/start_server.py']);

    // wait 10 secs
    await new Promise(resolve => setTimeout(resolve, 10000));

    server.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    server.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    server.on('close', (code) => {
      console.log(`server process ended with code: ${code}`);
    });
    await new Promise<void>((resolve, reject) => {
    let summary_text = spawn('python', ['../client/model/summary_text.py']);
    summary_text.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    }
    );
    summary_text.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    summary_text.on('close', (code) => {
      console.log(`summary_text process ended with code: ${code}`);
      server.kill();
      resolve();
    });
  });
  await new Promise<void>((resolve, reject) => {
    let vector_database_manager = spawn('python', ['../client/model/vector_database_manager_langchain.py']);
    vector_database_manager.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    }
    );
    vector_database_manager.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });
    vector_database_manager.on('close', (code) => {
      console.log(`vector_database_manager process ended with code: ${code}`);
      resolve();
    });
});









  } catch (err) {
    console.log(err)
  }
}