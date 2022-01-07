import { BrowserView } from 'electron'
import { mainWindow } from './window'
import { join } from 'path'

import { Navigator } from '../frontend/interfaces/Navigator'
import { blocker } from './adblocker'
import { isNavigationMoveMessage } from '../api/navigation'

export interface NavigatorContainer {
  navigator: Navigator,
  view: BrowserView
}

export const navigators: NavigatorContainer[] = []

export function createNavigator(navigator: Navigator, rect: {x: number, y: number, width: number, height: number}): NavigatorContainer|undefined {
  if (navigators.find(v=>v.navigator.uuid===navigator.uuid)) return
  let n = {
    navigator,
    view: new BrowserView({
      webPreferences: {
        preload: join(__dirname, 'navigator_preload.js'),
      }
    })
  }
  n.view.webContents.loadURL('https://kettek.net')
  n.view.setBounds(rect)

  // TODO: Ensure did-start-loading is the right time to send the tab's uuid.
  n.view.webContents.on('did-start-loading', () => {
    n.view.webContents.send('uuid', n.navigator.uuid)
  })

  n.view.webContents.on('page-title-updated', (_: Electron.Event, title: string, explicitSet: boolean) => {
    if (explicitSet) {
      mainWindow?.webContents.send('rife', {
        type: 'title',
        uuid: n.navigator.uuid,
        title: title,
      })
    }
  })

  n.view.webContents.on('page-favicon-updated', (_: Electron.Event, favicons: string[]) => {
    mainWindow?.webContents.send('rife', {
      type: 'favicon',
      uuid: n.navigator.uuid,
      favicons,
    })
  })

  n.view.webContents.on('did-navigate', (_: Electron.Event, url: string) => {
    console.log(n.navigator.uuid, 'did-navigate', url)
    mainWindow?.webContents.send('rife', {
      type: 'navigate',
      uuid: n.navigator.uuid,
      url,
      title: n.view.webContents.getTitle(),
    })
  })

  n.view.webContents.on('did-navigate-in-page', (_: Electron.Event, url: string) => {
    console.log(n.navigator.uuid, 'did-navigate-in-page', url)
    mainWindow?.webContents.send('rife', {
      type: 'navigate',
      uuid: n.navigator.uuid,
      url,
      inPage: true,
      title: n.view.webContents.getTitle(),
    })
  })

  n.view.webContents.on('render-process-gone', (_: Electron.Event, details: Electron.RenderProcessGoneDetails) => {
    console.log(n.navigator.uuid, 'render-process-gone', details)
  })

  n.view.webContents.on('unresponsive', (_: Electron.Event) => {
    console.log(n.navigator.uuid, 'unresponsive')
  })

  n.view.webContents.on('responsive', (_: Electron.Event) => {
    console.log(n.navigator.uuid, 'responsive')
  })

  n.view.webContents.on('devtools-opened', (_: Electron.Event) => {
    mainWindow?.webContents.send('rife', {
      type: 'devtools',
      uuid: n.navigator.uuid,
      state: 'open',
    })
  })
  n.view.webContents.on('devtools-closed', (_: Electron.Event) => {
    mainWindow?.webContents.send('rife', {
      type: 'devtools',
      uuid: n.navigator.uuid,
      state: 'closed',
    })
  })
  n.view.webContents.on('devtools-focused', (_: Electron.Event) => {
    mainWindow?.webContents.send('rife', {
      type: 'devtools',
      uuid: n.navigator.uuid,
      state: 'focused',
    })
  })

  // Rife IPC
  n.view.webContents.on('ipc-message', (_: Electron.Event, channel: string, msg: any) => {
    if (channel !== 'rife') return
    // Redirect navigation move messages to the our main window.
    if (isNavigationMoveMessage(msg)) {
      mainWindow?.webContents.send('rife', msg)
    }
  })

  // Enable adblock per default.
  blocker.enableBlockingInSession(n.view.webContents.session)
  mainWindow?.webContents.send('rife', {
    type: 'adblock-check',
    uuid: n.navigator.uuid,
    enabled: true,
  })

  navigators.push(n)
  return n
}

export function deleteNavigator(uuid: string) {
  let i = navigators.findIndex(v=>v.navigator.uuid===uuid)
  if (i === -1) return
  navigators.splice(i, 1)
}

export function getNavigator(uuid: string): NavigatorContainer | undefined {
  return navigators.find(v=>v.navigator.uuid === uuid)
}

export function clearNavigators() {
  navigators.splice(0, navigators.length)
}