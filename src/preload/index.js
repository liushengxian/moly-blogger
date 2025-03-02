const { contextBridge, ipcRenderer } = require('electron')
// const path = require('node:path')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // 除函数之外，我们也可以暴露变量
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
  readFile: (filePath) => ipcRenderer.invoke('workspace:readFile', filePath),
  // isMarkdown: (filePath) => path.extname(filePath).toLowerCase() === '.md'
})
