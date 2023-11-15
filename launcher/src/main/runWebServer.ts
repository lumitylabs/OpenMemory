import { mainWindow, python_env } from '.'
import { spawn } from 'child_process'
import fs from 'fs'
const logFile = 'logs.log'
import { shell } from 'electron';


function logToFile(message) {
  fs.appendFileSync(logFile, `${new Date().toISOString()}: ${message}\n`)
}

var isDataAPIRunning = false
var isLLMAPIRunning = false
var isWebServerRunning = false

export const runWebServer = async () => {
  
  try {
    
    if(!isDataAPIRunning){

        mainWindow.webContents.send('web-server-update', 'Starting dataAPI...');
        await new Promise<void>((resolve, reject) => {
            let dataAPI = spawn(python_env, ['../data_api/start_server.py'])
            isDataAPIRunning = true
      
            dataAPI.stdout.on('data', (data) => {
              logToFile(`stdout: ${data}`)
              resolve()
            })
      
            dataAPI.stderr.on('data', (data) => {
              logToFile(`stderr: ${data}`)
              isDataAPIRunning = false
              resolve()
            })
      
            dataAPI.on('close', (code) => {
              logToFile(`dataAPI ended with code: ${code}`)
              isDataAPIRunning = false
              resolve()
            })
      
            dataAPI.on('error', (err) => {
              isDataAPIRunning = false
              reject(err)
            })
          })
    }

    if(!isLLMAPIRunning){
      mainWindow.webContents.send('web-server-update', 'Starting llmAPI...');
        await new Promise<void>((resolve, reject) => {
            let llmAPI = spawn(python_env, ['../llm_api/start_server.py'])
            isLLMAPIRunning = true
      
            llmAPI.stdout.on('data', (data) => {
              logToFile(`stdout: ${data}`)
              resolve()
            })
      
            llmAPI.stderr.on('data', (data) => {
              logToFile(`stderr: ${data}`)
              isLLMAPIRunning = false
              resolve()
            })
      
            llmAPI.on('close', (code) => {
              logToFile(`llmAPI ended with code: ${code}`)
              isLLMAPIRunning = false
              resolve()
            })
      
            llmAPI.on('error', (err) => {
              isLLMAPIRunning = false
              reject(err)
            })
          })
    }

    if(!isWebServerRunning){
      mainWindow.webContents.send('web-server-update', 'Starting web server...');
        await new Promise<void>((resolve, reject) => {
            let server = spawn(python_env, ['../web/serve.py'])
            isWebServerRunning = true
      
            server.stdout.on('data', (data) => {
              logToFile(`stdout: ${data}`)
              resolve()
            })
      
            server.stderr.on('data', (data) => {
              logToFile(`stderr: ${data}`)
              isWebServerRunning = false
              resolve()
            })
      
            server.on('close', (code) => {
              logToFile(`Web server ended with code: ${code}`)
              isWebServerRunning = false
              resolve()
            })
      
            server.on('error', (err) => {
                isWebServerRunning = false
              reject(err)
            })
          })
    }
    await new Promise(resolve => setTimeout(resolve, 10000));
    await shell.openExternal('http://localhost:5182');
    mainWindow.webContents.send('web-server-update', 'Done');

    
  } catch (err) {
    logToFile(err)
  }
}
