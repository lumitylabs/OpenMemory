import { mainWindow, python_env, addProcess } from '.'
import { spawn } from 'child_process'
import { globalShortcut } from 'electron'
import fs from 'fs'
const logFile = 'logs.log'

function logToFile(message) {
  fs.appendFileSync(logFile, `${new Date().toISOString()}: ${message}\n`)
}

export const runDataServer = async () => {
  globalShortcut.register('Ctrl+Shift+P', () => {
    mainWindow.webContents.send('toggle-capture')
  })

  mainWindow.webContents.send('data-api-message', 'Starting dataAPI...')
  await new Promise<void>((resolve, reject) => {
    let dataAPI = spawn(python_env, ['../data_api/start_server.py'])
    addProcess(dataAPI)
    let serverReady = false

    dataAPI.stdout.on('data', (data) => {
      logToFile(`stdout: ${data}`)
    })

    dataAPI.stderr.on('data', (data) => {
      logToFile(`stderr: ${data}`)
      if (data.toString().includes('Application startup complete.')) {
        serverReady = true
        mainWindow.webContents.send('data-api-message', 'done')
        resolve()
      }

      resolve()
    })

    dataAPI.on('close', (code) => {
      logToFile(`dataAPI ended with code: ${code}`)
      mainWindow.close()
      if (!serverReady) {
        reject(new Error('Server closed before becoming ready'))
      }
    })

    dataAPI.on('error', (err) => {
      mainWindow.close()
      reject(err)
    })

    setTimeout(() => {
      if (!serverReady) {
        mainWindow.close()
        reject(new Error('Timeout: Server did not become ready'))
      }
    }, 30000) // 30 seconds timeout
  })
}
