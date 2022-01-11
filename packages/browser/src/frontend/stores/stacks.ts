import { writable, get } from 'svelte/store'
import { isNavigationFocusMessage, isNavigationMoveMessage, isNavigationShortcutEvent, NavigationEvent } from '../../api/navigation'
import { mkNavigatorStack, NavigatorStack } from '../interfaces/Stack'

const { subscribe, set, update } = writable<NavigatorStack>(mkNavigatorStack([]))

export const stackStore = {
  subscribe,
  set: (value: NavigatorStack) => {
    return set(value)
  },
  delete: (uuid: string) => {
    let ns = get(stackStore)

    let container = stackStore.findContainer(uuid)
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
  findContainer: (uuid: string): NavigatorStack|undefined => {
    let ns = get(stackStore)

    let find = (stack: NavigatorStack, uuid: string): NavigatorStack|undefined => {
      if (stack.uuid === uuid) return stack
      if (stack.stack) {
        return find(stack.stack, uuid)
      }
      return undefined
    }

    return find(ns, uuid)
  },
  move: ({ uuid, containerOf, container, side, focus}: {uuid: string, containerOf?: string, container?: string, side: string, focus?: boolean}) => {
    let ns = get(stackStore)
    
    let currentContainer = stackStore.findContainerFor(uuid)
    if (!currentContainer) {
      throw new Error(`couldn't find ${uuid}'s stack`)
    }

    let targetContainer: NavigatorStack | undefined

    if (container) {
      targetContainer = stackStore.findContainer(container)
    } else if (containerOf) {
      targetContainer = stackStore.findContainerFor(containerOf)
    } 
    if (!targetContainer) {
      throw new Error(`couldn't find ${container}/${containerOf}'s stack`)
    }

    // We probably shouldn't bail.
    if (currentContainer === targetContainer) {
      return
    }

    // Prepare to fix active navigator UUID.
    let activeIndex = -1
    if (currentContainer.activeNavigatorUUID === uuid) {
      activeIndex = currentContainer.navigatorUUIDs.findIndex(v=>v===uuid)
    }

    if (side === 'center') {
      currentContainer.navigatorUUIDs = currentContainer.navigatorUUIDs.filter(v=>v!==uuid)
      console.log(JSON.stringify(targetContainer.navigatorUUIDs))
      targetContainer.navigatorUUIDs = [
        ...targetContainer.navigatorUUIDs,
        uuid
      ]
      console.log('added uuid to end of target container')
      console.log(JSON.stringify(targetContainer.navigatorUUIDs))
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

    // Adjust our active navigator uuid if we need to.
    if (activeIndex >= 0) {
      currentContainer.activeNavigatorUUID = currentContainer.navigatorUUIDs[activeIndex] ?? currentContainer.navigatorUUIDs[activeIndex-1]
    }
    if (focus) {
      targetContainer.activeNavigatorUUID = uuid
    }
    set(ns)
  },
  removeNavigator(uuid: string) {
    let container = stackStore.findContainerFor(uuid)
    if (!container) return

    let ns = get(stackStore)

    // Get our retarget index for future usage.
    let retargetIndex = -1
    if (container.activeNavigatorUUID === uuid) {
      retargetIndex = container.navigatorUUIDs.findIndex(v=>v===uuid)
    }

    // Remove navigator from the stack.

    container.navigatorUUIDs = container.navigatorUUIDs.filter(v=>v!==uuid)

    // Set new active navigator if this navigator was focused.
    if (retargetIndex >= 0) {
      container.activeNavigatorUUID = container.navigatorUUIDs[retargetIndex] ?? container.navigatorUUIDs[retargetIndex-1]
    }

    set(ns)
  },
  addNavigator(containerUUID: string, uuid: string, switchTo: boolean) {
    let ns = get(stackStore)

    let container = stackStore.findContainer(containerUUID)
    if (!container) return

    container.navigatorUUIDs.push(uuid)

    if (switchTo) {
      container.activeNavigatorUUID = uuid
    }

    set(ns)
  },
  update,
}

export const focusedStackUUID = writable<string>('')

window.rife.registerToAll((o: NavigationEvent) => {
  if (isNavigationMoveMessage(o)) {
    stackStore.move({
      uuid: o.uuid,
      containerOf: o.toContainerOf,
      side: o.side,
    })
  } else if (isNavigationFocusMessage(o)) {
    let c = stackStore.findContainerFor(o.uuid)
    if (!c) return
    focusedStackUUID.set(c.uuid)
  } else if (isNavigationShortcutEvent(o)) {
    let c = stackStore.findContainer(get(focusedStackUUID))
    if (!c) return
    if (o.shortcut === 'close-navigator') {
      stackStore.removeNavigator(c.activeNavigatorUUID)
    }
  }
})