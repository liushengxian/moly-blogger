const { contextBridge, ipcRenderer } = require('electron')

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
  checkAuth: () => ipcRenderer.invoke('github:checkAuth')
})