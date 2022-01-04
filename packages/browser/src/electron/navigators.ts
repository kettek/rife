import { BrowserView } from 'electron'
import { mainWindow } from './window'

import { Navigator } from '../frontend/interfaces/Navigator'

export interface NavigatorContainer {
  navigator: Navigator,
  view: BrowserView
}

export const navigators: NavigatorContainer[] = []

export function createNavigator(navigator: Navigator, rect: {x: number, y: number, width: number, height: number}): NavigatorContainer|undefined {
  if (navigators.find(v=>v.navigator.uuid===navigator.uuid)) return
  let n = {
    navigator,
    view: new BrowserView()
  }
  n.view.webContents.loadURL('https://kettek.net')
  n.view.setBounds(rect)

  n.view.webContents.on('did-navigate', (_: Electron.Event, url: string) => {
    console.log(n.navigator.uuid, 'did-navigate', url)
    mainWindow?.webContents.send('rife', {
      type: 'navigate',
      uuid: n.navigator.uuid,
      url,
    })
  })

  n.view.webContents.on('did-navigate-in-page', (_: Electron.Event, url: string) => {
    console.log(n.navigator.uuid, 'did-navigate-in-page', url)
    mainWindow?.webContents.send('rife', {
      type: 'navigate',
      uuid: n.navigator.uuid,
      url,
      inPage: true,
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