import { ipcMain } from 'electron'
import { isNavigationShowMessage, isNavigationHideMessage, isNavigationPositionMessage, isNavigationCreateMessage, isNavigationDeleteMessage } from '../api/navigation'
import { createNavigator, deleteNavigator, getNavigator } from './navigators'
import { mainWindow } from './window'

ipcMain.handle('navigation', (_: Electron.IpcMainInvokeEvent, o: any) => {
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
  }
})
