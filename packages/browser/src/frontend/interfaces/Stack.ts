import { v4 } from 'uuid'

export interface NavigatorStack {
  uuid: string
  navigatorUUIDs: string[]
  stackDir: 'vertical' | 'horizontal'
  stackPos: number
  stack: NavigatorStack | undefined
}

export function mkNavigatorStack(navigatorUUIDs: string[]): NavigatorStack {
  return {
    uuid: v4(),
    navigatorUUIDs,
    stackDir: 'vertical',
    stackPos: 50,
    stack: undefined
  }
}