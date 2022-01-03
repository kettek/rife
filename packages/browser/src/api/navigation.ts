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
