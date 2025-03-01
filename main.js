const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const { createOAuthDeviceAuth } = require("@octokit/auth-oauth-device")
const path = require('path')
const isDev = process.env.NODE_ENV === 'development'

console.log(path.join(__dirname, 'preload.js'))

// Add these at the top of your file
const CLIENT_ID = 'YOUR_GITHUB_CLIENT_ID'
let authData = null

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Load the local index.html
  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }

  // Open DevTools automatically
  win.webContents.openDevTools()

  // Create the application menu
  const template = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: process.platform === 'darwin' ? 'Command+Option+I' : 'Control+Shift+I',
          click(item, focusedWindow) {
            if (focusedWindow) focusedWindow.webContents.toggleDevTools();
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  ipcMain.handle('github:login', async () => {
    try {
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