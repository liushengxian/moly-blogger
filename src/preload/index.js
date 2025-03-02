const { contextBridge, ipcRenderer, shell } = require('electron')
const { exec, spawn } = require('child_process')
const fs = require('fs').promises

contextBridge.exposeInMainWorld('api', {
  runCommand: (command, args = [], options = {}) => {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, options)

      process.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`)
      })

      process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`)
      })

      process.on('close', (code) => {
        if (code === 0) {
          resolve(`Process exited with code ${code}`)
        } else {
          reject(`Process exited with code ${code}`)
        }
      })

      process.on('error', (error) => {
        reject(error)
      })
    })
  },
  openExternal: (url) => shell.openExternal(url),
  checkRunningProcess: (processName) => {
    return new Promise((resolve, reject) => {
      exec(`ps aux | grep '${processName}' | grep -v grep`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error checking running process: ${stderr}`)
          reject(error)
        } else {
          resolve(stdout)
        }
      })
    })
  },
  writeFile: (filePath, content) => {
    return fs.writeFile(filePath, content, 'utf8')
  }
})

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
})

contextBridge.exposeInMainWorld('github', {
  login: () => ipcRenderer.invoke('github:login'),
  logout: () => ipcRenderer.invoke('github:logout'),
  checkAuth: () => ipcRenderer.invoke('github:checkAuth'),
  onOAuthCallback: (callback) => {
    ipcRenderer.on('github:oauth-callback', (event, data) => callback(data))
  }
})

// Workspace API
contextBridge.exposeInMainWorld('workspace', {
  openFolder: () => ipcRenderer.invoke('workspace:openFolder'),
  readDir: (folderPath) => ipcRenderer.invoke('workspace:readDir', folderPath),
  readFile: (filePath) => ipcRenderer.invoke('workspace:readFile', filePath)
})
