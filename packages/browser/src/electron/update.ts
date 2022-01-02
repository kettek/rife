import {
  Notification,
} from 'electron'
import { autoUpdater } from 'electron-updater'

import logger from './utils/logger'

const isProd = process.env.NODE_ENV === 'production' || !/[\\/]electron/.exec(process.execPath) // !process.execPath.match(/[\\/]electron/)

let notification: Notification | null

if (isProd) {
  autoUpdater.checkForUpdates().catch((err) => {
    logger.error(JSON.stringify(err))
  })
}

autoUpdater.logger = logger

autoUpdater.on('update-available', () => {
  notification = new Notification({
    title: 'Rife',
    body: 'Updates are available. Click to download.',
    silent: true,
    // icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'icon.png'),
  })
  notification.show()
  notification.on('click', () => {
    autoUpdater.downloadUpdate().catch((err) => {
      logger.error(JSON.stringify(err))
    })
  })
})

autoUpdater.on('update-not-available', () => {
  notification = new Notification({
    title: 'Rife',
    body: 'Your software is up to date.',
    silent: true,
    // icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'icon.png'),
  })
  notification.show()
})

autoUpdater.on('update-downloaded', () => {
  notification = new Notification({
    title: 'Rife',
    body: 'The updates are ready. Click to quit and install.',
    silent: true,
    // icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'icon.png'),
  })
  notification.show()
  notification.on('click', () => {
    autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', (err) => {
  notification = new Notification({
    title: 'Rife',
    body: JSON.stringify(err),
    // icon: nativeImage.createFromPath(join(__dirname, '..', 'assets', 'icon.png'),
  })
  notification.show()
})
