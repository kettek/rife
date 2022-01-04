import { contextBridge, ipcRenderer } from 'electron'
import { Navigator } from '../frontend/interfaces/Navigator'

contextBridge.exposeInMainWorld('rife', {
  show: (uuid: string) => ipcRenderer.invoke('rife', {
    type: 'show',
    uuid,
  }),
  hide: (uuid: string) => ipcRenderer.invoke('rife', {
    type: 'hide',
    uuid,
  }),
  position: (uuid: string, rect: {x: number, y: number, width: number, height: number}) => ipcRenderer.invoke('rife', {
    type: 'position',
    uuid,
    rect,
  }),
  create: (navigator: Navigator, rect: {x: number, y: number, width: number, height: number}) => ipcRenderer.invoke('rife', {
    type: 'create',
    navigator,
    rect,
  }),
  delete: (uuid: string) => ipcRenderer.invoke('rife', {
    type: 'delete',
    uuid,
  }),
  back: (uuid: string, query?: boolean) => ipcRenderer.invoke('rife', {
    type: 'back',
    uuid,
    query,
  }),
  forward: (uuid: string, query?: boolean) => ipcRenderer.invoke('rife', {
    type: 'forward',
    uuid,
    query,
  }),
  reload: (uuid: string) => ipcRenderer.invoke('rife', {
    type: 'reload',
    uuid,
  }),
})
