import { v4 } from 'uuid'

export interface History {
  location: string
  title: string
  favicon: string // Base64 encoded version of the favicon, used for navigation history popup.
}

export interface Navigator {
  uuid: string
  title: string
  url: string
  history: History[]
  activeHistoryPosition: number
  favicons: string[] // current list of favicons
  adblock: boolean // FIXME: This needs to be part of an extensions system.
  partition?: string // partition to use, for private mode or custom sessions.
  noCache?: boolean // whether or not to cache the partition session. If used on a partition that exists, the partition's cache will be cleared.
}
export function mkNavigator(): Navigator {
  return {
    uuid: v4(),
    history: [],
    title: '',
    url: '',
    activeHistoryPosition: 0,
    favicons: [],
    adblock: false,
  }
}