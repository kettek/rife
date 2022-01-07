import { v4 } from 'uuid'

export interface NavigatorStack {
  uuid: string
  navigatorUUIDs: string[]
  activeNavigatorUUID: string
  stackDir: 'vertical' | 'horizontal'
  stackPos: number
  stack: NavigatorStack | undefined
  parent: NavigatorStack | undefined
}

export function mkNavigatorStack(navigatorUUIDs: string[]): NavigatorStack {
  return {
    uuid: v4(),
    navigatorUUIDs,
    activeNavigatorUUID: navigatorUUIDs[0]||'',
    stackDir: 'vertical',
    stackPos: 50,
    stack: undefined,
    parent: undefined,
  }
}