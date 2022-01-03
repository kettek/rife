import { v4 } from 'uuid'

export interface History {
  location: string
  title: string
  favicon: string // Base64 encoded version of the favicon, used for navigation history popup.
}

export interface Navigator {
  uuid: string
  history: History[]
  activeHistoryPosition: number
}
export function mkNavigator(): Navigator {
  return {
    uuid: v4(),
    history: [],
    activeHistoryPosition: 0,
  }
}