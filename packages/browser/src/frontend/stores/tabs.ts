import type { Tab } from '../interfaces/Tab'

import { writable } from 'svelte/store'

export const tabsStore = writable<Tab[]>([
  {
    title: 'Tab A',
  },
  {
    title: 'Tab C',
  },
  {
    title: 'Tab D',
  },
  {
    title: 'Tab E',
  },
])