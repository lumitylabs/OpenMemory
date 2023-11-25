import { addProcess, getServerRunning, mainWindow, python_env, setServerRunning } from '.'
import { spawn } from 'child_process'
import fs from 'fs'
const logFile = 'logs.log'
import { shell } from 'electron';



function logToFile(message) {
  fs.appendFileSync(logFile, `${new Date().toISOString()}: ${message}\n`)
}




export const runWebServer = async () => {
  
  try {
    
    if(!getServerRunning()){
      mainWindow.webContents.send('web-server-update', 'Starting web server...');
        await new Promise<void>((resolve, reject) => {
            let server = spawn(python_env, ['../web/serve.py'])
            addProcess(server);
            setServerRunning(true);
      
            server.stdout.on('data', (data) => {
              logToFile(`stdout: ${data}`)
              resolve()
            })
      
            server.stderr.on('data', (data) => {
              logToFile(`stderr: ${data}`)
              resolve()
            })
      
            server.on('close', (code) => {
              logToFile(`Web server ended with code: ${code}`)
              setServerRunning(false);
              resolve()
            })
      
            server.on('error', (err) => {
              setServerRunning(false);
              reject(err)
            })
          })
    }

    await shell.openExternal('http://localhost:5182');
    mainWindow.webContents.send('web-server-update', 'Done');

    
  } catch (err) {
    logToFile(err)
  }
}
