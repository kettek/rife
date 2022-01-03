import { writable } from 'svelte/store'
import type { Navigator } from '../interfaces/Navigator'

export const navigatorStore = writable<Navigator[]>([
])