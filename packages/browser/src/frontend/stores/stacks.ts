import { writable } from 'svelte/store'
import { mkNavigatorStack, NavigatorStack } from '../interfaces/Stack'

export const stackStore = writable<NavigatorStack>(
  mkNavigatorStack([])
)