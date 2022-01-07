import { writable, get } from 'svelte/store'
import { isNavigationMoveMessage, NavigationEvent } from '../../api/navigation'
import { mkNavigatorStack, NavigatorStack } from '../interfaces/Stack'

const { subscribe, set, update } = writable<NavigatorStack>(mkNavigatorStack([]))

export const stackStore = {
  subscribe,
  set: (value: NavigatorStack) => {
    return set(value)
  },
  delete: (uuid: string) => {
    let ns = get(stackStore)

    let find = (stack: NavigatorStack): NavigatorStack|undefined => {
      if (stack.uuid === uuid) {
        return stack
      }
      if (stack.stack) {
        return find(stack.stack)
      }
      return undefined
    }
    let container = find(ns)
    if (!container) {
      throw new Error(`couldn't find stack ${uuid}`)
    }
    if (!container.parent) {
      throw new Error(`${uuid} has no parent, not deleting`)
    }
    container.parent.stack = undefined
    set(ns)
  },
  findContainerFor: (uuid: string): NavigatorStack|undefined => {
    let ns = get(stackStore)

    let find = (stack: NavigatorStack, uuid: string): NavigatorStack|undefined => {
      if (stack.navigatorUUIDs.includes(uuid)) {
        return stack
      }
      if (stack.stack) {
        return find(stack.stack, uuid)
      }
      return undefined
    }

    return find(ns, uuid)
  },
  move: (uuid: string, containerOf: string, side: string) => {
    let ns = get(stackStore)
    
    let currentContainer = stackStore.findContainerFor(uuid)
    if (!currentContainer) {
      throw new Error(`couldn't find ${uuid}'s stack`)
    }
    let targetContainer = stackStore.findContainerFor(containerOf)
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
      // Fix relationships.
      newStack.parent = targetContainer
      if (newStack.stack) {
        newStack.stack.parent = newStack
      }
    } else if (side === 'right' || side === 'bottom') {
      currentContainer.navigatorUUIDs = currentContainer.navigatorUUIDs.filter(v=>v!==uuid)
      let newStack = mkNavigatorStack([uuid])
      if (targetContainer.stack) {
        newStack.stackDir = targetContainer.stackDir
        newStack.stackPos = targetContainer.stackPos
        newStack.stack = targetContainer.stack
        // Fix relationships.
        newStack.stack.parent = newStack
      }
      targetContainer.stack = newStack
      targetContainer.stackDir = side==='right'?'horizontal':'vertical'
      // Fix relationships.
      targetContainer.stack.parent = targetContainer
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