const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs').promises
require('dotenv').config()
const isDev = process.env.NODE_ENV === 'development'

// Use environment variable for CLIENT_ID
const CLIENT_ID = process.env.GITHUB_CLIENT_ID
let authData = null
let mainWindow = null

// Validate required environment variables
if (!CLIENT_ID) {
  console.error('Missing GITHUB_CLIENT_ID environment variable')
  app.quit()
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('moly-blogger', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('moly-blogger')
}

// Handle the protocol on macOS
app.on('open-url', (event, url) => {
  event.preventDefault()
  handleUrl(url)
})

function handleUrl(url) {
  const urlObj = new URL(url)
  if (urlObj.protocol === 'moly-blogger:' && urlObj.hostname === 'login') {
    // Extract any parameters from the URL if needed
    const params = new URLSearchParams(urlObj.search)
    const code = params.get('code')
    if (code && mainWindow) {
      mainWindow.webContents.send('github:oauth-callback', { code })
    }
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: false
    }
  })

  // For debugging preload script path
  // console.log('Preload script path:', path.join(__dirname, 'preload.js'))

  // Load the index.html
  console.log("is Dev: ", isDev)
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173') // Default Vite dev server URL
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist', 'index.html'))
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load preload script:', errorDescription)
  })
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  ipcMain.handle('github:login', async () => {
    try {
      const { createOAuthDeviceAuth } = await import('@octokit/auth-oauth-device')

      const auth = createOAuthDeviceAuth({
        clientId: CLIENT_ID,
        scopes: ['repo', 'user'],
        onVerification(verification) {
          // Show device activation instructions
          const { verification_uri, user_code } = verification
          // You should show this to the user
          console.log("Please visit:", verification_uri)
          console.log("Enter code:", user_code)
        }
      })

      authData = await auth({
        type: "oauth-device",
      })

      // Get user info
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      })
      const user = await response.json()

      return {
        success: true,
        username: user.login,
        avatar: user.avatar_url
      }
    } catch (error) {
      console.error('GitHub auth error:', error)
      return { success: false }
    }
  })

  ipcMain.handle('github:logout', () => {
    authData = null
    return true
  })

  ipcMain.handle('github:checkAuth', async () => {
    if (!authData) return { isLoggedIn: false }

    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      })
      const user = await response.json()

      return {
        isLoggedIn: true,
        username: user.login,
        avatar: user.avatar_url
      }
    } catch {
      authData = null
      return { isLoggedIn: false }
    }
  })

  ipcMain.handle('workspace:openFolder', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })
    return result.filePaths[0]
  })

  ipcMain.handle('workspace:readDir', async (event, folderPath) => {
    try {
      const files = await fs.readdir(folderPath, { withFileTypes: true })
      const items = files.map(file => ({
        isDirectory: file.isDirectory(),
        path: path.join(folderPath, file.name),
        name: file.name
      }))
      return items
    } catch (error) {
      console.error('Failed to read directory:', error)
      return []
    }
  })

  ipcMain.handle('workspace:readFile', async (event, filePath) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8')
      return content
    } catch (error) {
      console.error('Failed to read file:', error)
      return null
    }
  })

  createWindow()

  // for mac system 
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// windows & linux
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})