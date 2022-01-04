import type { Navigator } from '../frontend/interfaces/Navigator'

export interface NavigationShowMessage {
  type: 'show'
  uuid: string
}
export function isNavigationShowMessage(o: any): o is NavigationShowMessage {
  return o.type === 'show'
}

export interface NavigationHideMessage {
  type: 'hide'
  uuid: string
}
export function isNavigationHideMessage(o: any): o is NavigationHideMessage {
  return o.type === 'hide'
}

export interface NavigationPositionMessage {
  type: 'position'
  uuid: string
  rect: {
    x: number
    y: number
    width: number
    height: number
  },
}
export function isNavigationPositionMessage(o: any): o is NavigationPositionMessage {
  return o.type === 'position'
}

export interface NavigationCreateMessage {
  type: 'create'
  navigator: Navigator
  rect: {
    x: number
    y: number
    width: number
    height: number
  },
}
export function isNavigationCreateMessage(o: any): o is NavigationCreateMessage {
  return o.type === 'create'
}

export interface NavigationDeleteMessage {
  type: 'delete'
  uuid: string
}
export function isNavigationDeleteMessage(o: any): o is NavigationDeleteMessage {
  return o.type === 'delete'
}

export interface NavigationNavigateMessage {
  type: 'navigate'
  uuid: string
  url: string
}
export function isNavigationNavigateMessage(o: any): o is NavigationNavigateMessage {
  return o.type === 'navigate'
}

export interface NavigationNavigateResult {
  type: 'navigate-result'
  uuid: string
  title: string
  favicon: string
}
export function isNavigationNavigateResult(o: any): o is NavigationNavigateResult {
  return o.type === 'navigate-result'
}

export interface NavigationBackMessage {
  type: 'back'
  uuid: string
  query?: boolean
}
export function isNavigationBackMessage(o: any): o is NavigationBackMessage {
  return o.type === 'back'
}

export interface NavigationForwardMessage {
  type: 'forward'
  uuid: string
  query?: boolean
}
export function isNavigationForwardMessage(o: any): o is NavigationForwardMessage {
  return o.type === 'forward'
}

export interface NavigationReloadMessage {
  type: 'reload'
  uuid: string
}
export function isNavigationReloadMessage(o: any): o is NavigationReloadMessage {
  return o.type === 'reload'
}
