import { ipcMain } from 'electron'
import { isNavigationShowMessage, isNavigationHideMessage, isNavigationPositionMessage, isNavigationCreateMessage, isNavigationDeleteMessage, isNavigationNavigateMessage, isNavigationBackMessage, isNavigationForwardMessage, isNavigationReloadMessage } from '../api/navigation'
import { createNavigator, deleteNavigator, getNavigator } from './navigators'
import { mainWindow } from './window'

ipcMain.handle('rife', async (_: Electron.IpcMainInvokeEvent, o: any): Promise<any> => {
  if (isNavigationShowMessage(o)) {
    let n = getNavigator(o.uuid)
    if (!n) return
    mainWindow?.addBrowserView(n.view)
    // BUG: We have to setBounds to our getBounds, otherwise the view will be white...
    n.view.setBounds(n.view.getBounds())
  } else if (isNavigationHideMessage(o)) {
    let n = getNavigator(o.uuid)
    if (!n) return
    mainWindow?.removeBrowserView(n.view)
  } else if (isNavigationPositionMessage(o)) {
    let n = getNavigator(o.uuid)
    if (!n) return
    n.view.setBounds({x: Math.round(o.rect.x), y: Math.round(o.rect.y), width: Math.round(o.rect.width), height: Math.round(o.rect.height)})
  } else if (isNavigationCreateMessage(o)) {
    createNavigator(o.navigator, o.rect)
  } else if (isNavigationDeleteMessage(o)) {
    let n = getNavigator(o.uuid)
    if (!n) return
    mainWindow?.removeBrowserView(n.view)
    deleteNavigator(o.uuid)
  } else if (isNavigationNavigateMessage(o)) {
    let n = getNavigator(o.uuid)
    if (!n) return
    n.view.webContents.loadURL(o.url)
  } else if (isNavigationBackMessage(o)) {
    let n = getNavigator(o.uuid)
    if (!n) return
    console.log(o)
    if (o.query) {
      return n.view.webContents.canGoBack()
    } else {
      n.view.webContents.goBack()
    }
  } else if (isNavigationForwardMessage(o)) {
    let n = getNavigator(o.uuid)
    if (!n) return
    if (o.query) {
      return n.view.webContents.canGoForward()
    } else {
      n.view.webContents.goForward()
    }
  } else if (isNavigationReloadMessage(o)) {
    let n = getNavigator(o.uuid)
    if (!n) return
    n.view.webContents.reload()
  }
})
