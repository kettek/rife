import { ElectronBlocker, fullLists, Request } from '@cliqz/adblocker-electron'
//import { readFileSync, writeFileSync } from 'fs'
import fetch from 'cross-fetch'

export let blocker: ElectronBlocker

export async function loadAdblocker() {
  blocker = await ElectronBlocker.fromLists(
    fetch,
    fullLists,
    {
      enableCompression: true,
    },
    /*{
      path: 'engine.bin',
      read: async (...args) => readFileSync(...args),
      write: async (...args) => writeFileSync(...args),
    },*/
  )

  blocker.on('request-blocked', (request: Request) => {
    console.log('blocked', request.tabId, request.url)
  })

  blocker.on('request-redirected', (request: Request) => {
    console.log('redirected', request.tabId, request.url)
  })

  blocker.on('request-whitelisted', (request: Request) => {
    console.log('whitelisted', request.tabId, request.url)
  })

  blocker.on('csp-injected', (request: Request) => {
    console.log('csp', request.url)
  })

  blocker.on('script-injected', (script: string, url: string) => {
    console.log('script', script.length, url)
  })

  blocker.on('style-injected', (style: string, url: string) => {
    console.log('style', style.length, url)
  })
}