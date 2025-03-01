const { app, BrowserWindow, ipcMain, Menu, protocol, dialog } = require('electron')
const path = require('path')
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

// Add this function to watch for file changes
function watchForChanges(win) {
  if (isDev) {
    // Watch the dist directory for changes
    require('fs').watch(path.join(__dirname, 'dist'), (eventType, filename) => {
      if (filename) {
        // Debounce the reload to prevent multiple reloads
        if (win && win.webContents) {
          clearTimeout(win.reloadTimeout)
          win.reloadTimeout = setTimeout(() => {
            console.log('Reloading window...')
            win.reload()
          }, 100)
        }
      }
    })
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
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
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'))
  }

  // Open DevTools automatically
  mainWindow.webContents.openDevTools()

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
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Select Workspace Folder'
    })

    if (!result.canceled) {
      return {
        success: true,
        path: result.filePaths[0]
      }
    }
    return {
      success: false,
      path: null
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