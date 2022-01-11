import {
  app,
  BrowserWindow,
  globalShortcut,
} from 'electron'
import { join } from 'path'

import logger from './utils/logger'
import settings from './utils/settings'
import { clearNavigators, navigators } from './navigators'
import { loadAdblocker } from './adblocker'

import './views'

const isProd = process.env.NODE_ENV === 'production' || !/[\\/]electron/.exec(process.execPath) // !process.execPath.match(/[\\/]electron/)

logger.info('App starting...')
settings.set('check', true)
logger.info('Checking if settings store works correctly.')
logger.info(settings.get('check') ? 'Settings store works correctly.' : 'Settings store has a problem.')

import { mainWindow, setMainWindow } from './window'

const createWindow = async () => {
  await loadAdblocker()
  setMainWindow(new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      devTools: isProd ? false : true,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  }))
  if (!mainWindow) return


  // Global shortcuts for handling reloading, new tab, close tab, etc.
  mainWindow.on('focus', () => {
    globalShortcut.register("CommandOrControl+R", () => {
      console.log('send reload to focused navigator')
    })
    globalShortcut.register("F5", () => {
      console.log('send reload to focused navigator')
    })
    globalShortcut.register("CommandOrControl+W", () => {
      console.log('send close to focused navigator')
    })
    globalShortcut.register("CommandOrControl+T", () => {
      console.log('send new tab to focused stack')
    })
  })

  mainWindow.on('blur', () => {
    globalShortcut.unregister('CommandOrControl+R')
    globalShortcut.unregister('F5')
    globalShortcut.unregister("CommandOrControl+W")
    globalShortcut.unregister("CommandOrControl+T")
  })

  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    // Reset navigators on navigation.
    for (let n of navigators) {
      mainWindow?.removeBrowserView(n.view)
    }
    clearNavigators()

    const parsedURL = new URL(navigationUrl)
    // In dev mode allow Hot Module Replacement
    if (parsedURL.host !== 'localhost:5000' && !isProd) {
      logger.warn('Stopped attempt to open: ' + navigationUrl)
      event.preventDefault()
    } else if (isProd) {
      logger.warn('Stopped attempt to open: ' + navigationUrl)
      event.preventDefault()
    }
  })

  const url =
    isProd
      ? // in production, use the statically build version of our application
        `file://${join(__dirname, 'public', 'index.html')}`
      : // in dev, target the host and port of the local rollup web server
        'http://localhost:5000'

  mainWindow.loadURL(url).catch((err) => {
    logger.error(JSON.stringify(err))
    app.quit()
  })

  if (!isProd) mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    setMainWindow(null)
  })
}

app.on('ready', createWindow)

// those two events are completely optional to subscrbe to, but that's a common way to get the
// user experience people expect to have on macOS: do not quit the application directly
// after the user close the last window, instead wait for Command + Q (or equivalent).
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})

app.on('web-contents-created', (e, contents) => {
  logger.info(e)
  // Security of webviews
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    logger.info(event, params)
    // Strip away preload scripts if unused or verify their location is legitimate
    delete webPreferences.preload

    // Disable Node.js integration
    webPreferences.nodeIntegration = false

    // Verify URL being loaded
    // if (!params.src.startsWith(`file://${join(__dirname)}`)) {
    //   event.preventDefault() // We do not open anything now
    // }
  })
})

import './update'

