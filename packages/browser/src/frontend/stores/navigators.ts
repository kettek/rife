import { writable, get, Updater } from 'svelte/store'
import { isNavigationCheckAdblockEvent, isNavigationDevtoolsEvent, isNavigationFaviconEvent, isNavigationFocusMessage, isNavigationMoveMessage, isNavigationNavigateEvent, isNavigationShowEvent, isNavigationTitleEvent, NavigationEvent } from '../../api/navigation'
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
    window.rife.create(n, {x: 0, y: 0, width: 0, height: 0})
    v.push(n)
    set(v)
  },
  remove: (uuid: string) => {
    let v = get(navigatorStore)
    v = v.filter(v=>v.uuid!==uuid)
    window.rife.delete(uuid)
    set(v)
  },
  update: (updater: Updater<Navigator[]>) => {
    console.log('wut', updater)
    update(updater)
  }
}

// Bind navigation updates from main process.
window.rife.registerToAll((o: NavigationEvent) => {
  if (isNavigationNavigateEvent(o)) {
    let ns = get(navigatorStore)
    let n = ns.find(v=>v.uuid === o.uuid)
    if (!n) return
    n.title = o.title
    n.url = o.url
    navigatorStore.set(ns)
  } else if (isNavigationShowEvent(o)) {
  } else if (isNavigationTitleEvent(o)) {
    let ns = get(navigatorStore)
    let n = ns.find(v=>v.uuid === o.uuid)
    if (!n) return
    n.title = o.title
    navigatorStore.set(ns)
  } else if (isNavigationFaviconEvent(o)) {
    let ns = get(navigatorStore)
    let n = ns.find(v=>v.uuid === o.uuid)
    if (!n) return
    n.favicons = o.favicons
    navigatorStore.set(ns)
  } else if (isNavigationDevtoolsEvent(o)) {
    console.log('devtools', o)
  } else if (isNavigationCheckAdblockEvent(o)) {
    let ns = get(navigatorStore)
    let n = ns.find(v=>v.uuid === o.uuid)
    if (!n) return
    console.log('set adblock')
    n.adblock = o.enabled
    navigatorStore.set(ns)
  } else if (isNavigationMoveMessage(o)) {
    console.log('TODO', o)
  } else if (isNavigationFocusMessage(o)) {
    focusedNavigatorUUID.set(o.uuid)
  }
})

export const focusedNavigatorUUID = writable<string>('')