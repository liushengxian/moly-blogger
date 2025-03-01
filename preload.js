const { contextBridge, ipcRenderer } = require('electron')
const fs = require('fs')
const path = require('path')

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
  isMarkdown: (filePath) => path.extname(filePath).toLowerCase() === '.md'
})

// Add database API
contextBridge.exposeInMainWorld('database', {
  // Workspace operations
  addWorkspace: (path) => ipcRenderer.invoke('database:addWorkspace', path),
  getWorkspaces: () => ipcRenderer.invoke('database:getWorkspaces'),

  // Post operations
  createPost: (title, content, workspacePath) =>
    ipcRenderer.invoke('database:createPost', title, content, workspacePath),
  updatePost: (id, title, content) =>
    ipcRenderer.invoke('database:updatePost', id, title, content),
  getPosts: (workspacePath) => ipcRenderer.invoke('database:getPosts', workspacePath),
  getPost: (id) => ipcRenderer.invoke('database:getPost', id),
  deletePost: (id) => ipcRenderer.invoke('database:deletePost', id)
})