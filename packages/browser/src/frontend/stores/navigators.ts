import { writable, get, Updater } from 'svelte/store'
import type { Navigator } from '../interfaces/Navigator'

//import { ipcRenderer } from 'electron'
//const { ipcRenderer } = require('electron')

const { subscribe, set, update } = writable<Navigator[]>([])

export const navigatorStore = {
  subscribe,
  set: (value: Navigator[]) => {
    return set(value)
  },
  add: (n: Navigator) => {
    let v = get(navigatorStore)
    if (v.find(v=>v.uuid===n.uuid)) {
      return
    }
    console.log('add', n)
    window.rife.create(n, {x: 0, y: 0, width: 0, height: 0})
    v.push(n)
    set(v)
  },
  remove: (n: Navigator) => {
    let v = get(navigatorStore)
    v = v.filter(v=>v.uuid!==n.uuid)
    window.rife.delete(n.uuid)
    set(v)
  },
  update: (updater: Updater<Navigator[]>) => {
    console.log('wut', updater)
    update(updater)
  }
}