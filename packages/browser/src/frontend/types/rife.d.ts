import { Navigator } from '../interfaces/Navigator'
import type { RegisterCallback } from '../../api/navigation'

export interface IRifeAPI {
  show: (uuid: string) => Promise<void>,
  hide: (uuid: string) => Promise<void>,
  position: (uuid: string, rect: {x: number, y: number, width: number, height: number}) => Promise<void>,
  create: (navigator: Navigator, rect: {x: number, y: number, width: number, height: number}) => Promise<void>,
  delete: (uuid: string) => Promise<void>,
  back: (uuid: string, query?: boolean) => Promise<boolean>,
  forward: (uuid: string, query?: boolean) => Promise<boolean>,
  navigate: (uuid: string, url: string) => Promise<void>,
  reload: (uuid: string) => Promise<void>,
  toggleDevtools: (uuid: string) => Promise<void>,
  toggleAdblock: (uuid: string) => Promise<boolean>,
  register: (uuid: string, callback: RegisterCallback) => Promise<any>,
  unregister: (uuid: string, callback: RegisterCallback) => Promise<any>,
  registerToAll: (callback: RegisterCallback) => Promise<any>,
  unregisterToAll: (callback: RegisterCallback) => Promise<any>,
}

declare global {
  interface Window {
    rife: IRifeAPI
  }
}