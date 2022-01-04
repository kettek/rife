import { Navigator } from '../interfaces/Navigator'

export interface IRifeAPI {
  show: (uuid: string) => Promise<void>,
  hide: (uuid: string) => Promise<void>,
  position: (uuid: string, rect: {x: number, y: number, width: number, height: number}) => Promise<void>,
  create: (navigator: Navigator, rect: {x: number, y: number, width: number, height: number}) => Promise<void>,
  delete: (uuid: string) => Promise<void>,
}

declare global {
  interface Window {
    rife: IRifeAPI
  }
}