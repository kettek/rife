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
  reload: (uuid: string) => Promise<void>,
  register: (uuid: string, callback: RegisterCallback) => Promise<any>,
  unregister: (uuid: string, callback: RegisterCallback) => Promise<any>,
}

declare global {
  interface Window {
    rife: IRifeAPI
  }
}