import { contextBridge, ipcRenderer } from 'electron'
import { Navigator } from '../frontend/interfaces/Navigator'

contextBridge.exposeInMainWorld('navigation', {
  show: (uuid: string) => ipcRenderer.invoke('navigation', {
    type: 'show',
    uuid,
  }),
  hide: (uuid: string) => ipcRenderer.invoke('navigation', {
    type: 'hide',
    uuid,
  }),
  position: (uuid: string, rect: {x: number, y: number, width: number, height: number}) => ipcRenderer.invoke('navigation', {
    type: 'position',
    uuid,
    rect,
  }),
  create: (navigator: Navigator, rect: {x: number, y: number, width: number, height: number}) => ipcRenderer.invoke('navigation', {
    type: 'create',
    navigator,
    rect,
  }),
  delete: (uuid: string) => ipcRenderer.invoke('navigation', {
    type: 'delete',
    uuid,
  })
})
