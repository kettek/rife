import { BrowserView } from 'electron'

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