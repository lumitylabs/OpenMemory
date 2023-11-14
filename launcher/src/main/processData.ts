
import {  mainWindow, python_env } from '.'

import { spawn } from 'child_process'
import fs from 'fs'
const logFile = 'logs.log';

function logToFile(message) {
  fs.appendFileSync(logFile, `${new Date().toISOString()}: ${message}\n`);
}


export const processData = async () => {
  try {
    mainWindow.webContents.send('process-data-update', 'Running data processing...');
    await new Promise<void>((resolve, reject) => {
      let dataProcessor = spawn(python_env, ['../client/sensors/audio_processor.py']);

      dataProcessor.stdout.on('data', (data) => {
        logToFile(`stdout: ${data}`);
      });

      dataProcessor.stderr.on('data', (data) => {
        logToFile(`stderr: ${data}`);
      });

      dataProcessor.on('close', (code) => {
        logToFile(`dataProcessor ended with code: ${code}`);
        resolve();
      });

      dataProcessor.on('error', (err) => {
        reject(err);
      });
    });
    mainWindow.webContents.send('process-data-update', 'Creating memories...');
    let server = spawn(python_env, ['../llm_api/start_server.py']);

    // wait 10 secs
    await new Promise(resolve => setTimeout(resolve, 10000));

    server.stdout.on('data', (data) => {
      logToFile(`stdout: ${data}`);
    });

    server.stderr.on('data', (data) => {
      logToFile(`stderr: ${data}`);
    });

    server.on('close', (code) => {
      logToFile(`server process ended with code: ${code}`);
    });
    await new Promise<void>((resolve, _) => {
    let summary_text = spawn(python_env, ['../client/model/summary_text.py']);
    summary_text.stdout.on('data', (data) => {
      logToFile(`stdout: ${data}`);
    }
    );
    summary_text.stderr.on('data', (data) => {
      logToFile(`stderr: ${data}`);
    });
    summary_text.on('close', (code) => {
      logToFile(`summary_text process ended with code: ${code}`);
      server.kill();
      resolve();
    });
  });
  mainWindow.webContents.send('process-data-update', 'Creating vectors...');
  await new Promise<void>((resolve, _) => {
    let vector_database_manager = spawn(python_env, ['../client/model/vector_database_manager_langchain.py']);
    vector_database_manager.stdout.on('data', (data) => {
      logToFile(`stdout: ${data}`);
    }
    );
    vector_database_manager.stderr.on('data', (data) => {
      logToFile(`stderr: ${data}`);
    });
    vector_database_manager.on('close', (code) => {
      logToFile(`vector_database_manager process ended with code: ${code}`);
      resolve();
    });
});
mainWindow.webContents.send('process-data-update', 'Done');

  } catch (err) {
    logToFile(err)
  }
}