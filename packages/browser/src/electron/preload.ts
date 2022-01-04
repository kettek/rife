import { contextBridge, ipcRenderer } from 'electron'
import { NavigationEvent, RegisterCallback } from '../api/navigation'
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
  register: (uuid: string, callback: RegisterCallback) => {
    if (!registered[uuid]) {
      registered[uuid] = []
    }
    if (!(registered[uuid].find(v=>v===callback))) {
      registered[uuid].push(callback)
    }
    if (registered[uuid].length === 0) {
      delete registered[uuid]
    }
  },
  unregister: (uuid: string, callback: RegisterCallback) => {
    if (!registered[uuid]) return
    registered[uuid] = registered[uuid].filter(v=>v!==callback)
    if (registered[uuid].length === 0) {
      delete registered[uuid]
    }
  },
})

let registered: Record<string, RegisterCallback[]> = {}

ipcRenderer.on('rife', (_: Electron.IpcRendererEvent, o: NavigationEvent) => {
  if (!registered[o.uuid]) return
  for (let cb of registered[o.uuid]) {
    cb(o)
  }
})