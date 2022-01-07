import { writable, get } from 'svelte/store'
import { isNavigationMoveMessage, NavigationEvent } from '../../api/navigation'
import { mkNavigatorStack, NavigatorStack } from '../interfaces/Stack'

const { subscribe, set, update } = writable<NavigatorStack>(mkNavigatorStack([]))

export const stackStore = {
  subscribe,
  set: (value: NavigatorStack) => {
    return set(value)
  },
  move: (uuid: string, containerOf: string, side: string) => {
    let ns = get(stackStore)
    
    let findContainer = (stack: NavigatorStack, uuid: string): NavigatorStack|undefined => {
      if (stack.navigatorUUIDs.includes(uuid)) {
        return stack
      }
      if (stack.stack) {
        return findContainer(stack.stack, uuid)
      }
      return undefined
    }

    let currentContainer = findContainer(ns, uuid)
    if (!currentContainer) {
      throw new Error(`couldn't find ${uuid}'s stack`)
    }
    let targetContainer = findContainer(ns, containerOf)
    if (!targetContainer) {
      throw new Error(`couldn't find ${containerOf}'s stack`)
    }

    if (side === 'center') {
      currentContainer.navigatorUUIDs = currentContainer.navigatorUUIDs.filter(v=>v!==uuid)
      targetContainer.navigatorUUIDs.push(uuid)
    } else if (side === 'left' || side === 'top') {
      currentContainer.navigatorUUIDs = currentContainer.navigatorUUIDs.filter(v=>v!==uuid)
      let tempStack = mkNavigatorStack([uuid])
      let newStack = {...targetContainer}
      targetContainer.uuid = tempStack.uuid
      targetContainer.activeNavigatorUUID = uuid
      targetContainer.navigatorUUIDs = tempStack.navigatorUUIDs
      targetContainer.stackDir = side==='left'?'horizontal':'vertical'
      targetContainer.stack = newStack
    } else if (side === 'right' || side === 'bottom') {
      currentContainer.navigatorUUIDs = currentContainer.navigatorUUIDs.filter(v=>v!==uuid)
      let newStack = mkNavigatorStack([uuid])
      if (targetContainer.stack) {
        newStack.stackDir = targetContainer.stackDir
        newStack.stackPos = targetContainer.stackPos
        newStack.stack = targetContainer.stack
      }
      targetContainer.stack = newStack
      targetContainer.stackDir = side==='right'?'horizontal':'vertical'
    }
    set(ns)
  },
  update,
}

window.rife.registerToAll((o: NavigationEvent) => {
  if (isNavigationMoveMessage(o)) {
    stackStore.move(o.uuid, o.toContainerOf, o.side)
  }
})