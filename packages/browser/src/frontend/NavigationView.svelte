<script context='module' lang='ts'>
  import elementResizeDetectorMaker from 'element-resize-detector'
  const erd = elementResizeDetectorMaker({
    strategy: 'scroll',
  })

</script>

<script lang='ts'>
  import { onMount } from 'svelte'

  import type { Navigator } from './interfaces/Navigator'
  import type { NavigatorStack } from './interfaces/Stack'
  import { navigatorStore } from './stores/navigators'
  import type { NavigationEvent } from '../api/navigation'
  import { isNavigationNavigateEvent } from '../api/navigation'
  import { dragCount } from './stores/tabs'

  export let stack: NavigatorStack
  let activeNavigator: Navigator | undefined
  let bounds = new DOMRect(0,0,0,0)
  $: activeNavigator = $navigatorStore.find(v=>v.uuid===stack.activeNavigatorUUID)

  $: currentHistory = activeNavigator?.history
  $: currentHistoryEntry = (currentHistory && activeNavigator) ? currentHistory[activeNavigator.activeHistoryPosition] : { location: '', title: '', favicon: '' }

  let canGoBack: boolean = false
  let canGoForward: boolean = false
  let currentURL: string = ''

  let lastActiveNavigatorUUID: string = ''
  $: {
    if (stack.activeNavigatorUUID !== lastActiveNavigatorUUID) {
      window.rife.unregister(lastActiveNavigatorUUID, handleNavigation)
      window.rife.register(stack.activeNavigatorUUID, handleNavigation)

      console.log('hide', lastActiveNavigatorUUID)
      window.rife.hide(lastActiveNavigatorUUID)

      window.rife.position(stack.activeNavigatorUUID, {x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height-24})

      window.rife.show(stack.activeNavigatorUUID)

      console.log('show', stack.activeNavigatorUUID)

      lastActiveNavigatorUUID = stack.activeNavigatorUUID

      window.rife.back(stack.activeNavigatorUUID, true).then((can: boolean) => {
        canGoBack = can
      })
      window.rife.forward(stack.activeNavigatorUUID, true).then((can: boolean) => {
        canGoForward = can
      })
    }
  }
  async function handleNavigation(o: NavigationEvent) {
    if (!activeNavigator) return
    if (isNavigationNavigateEvent(o)) {
      currentURL = o.url
      canGoBack = await window.rife.back(activeNavigator.uuid, true)
      canGoForward = await window.rife.forward(activeNavigator.uuid, true)
    }
  }

  function handleDragEnter(e: DragEvent) {
  }
  function handleDragLeave(e: DragEvent) {
  }
  function handleDrop(e: DragEvent) {
    let uuid = e.dataTransfer?.getData('text')
    if (!uuid) return
    e.preventDefault()
    e.stopPropagation()

    console.log('we got a droppie drop', e)
    if (stack.navigatorUUIDs.includes(uuid)) {
      // is already here... move it to end?
    } else {
      stack.navigatorUUIDs.push(uuid)
      stack = stack
      $dragCount++
    }
  }

  async function goBack() {
    if (!activeNavigator) return
    window.rife.back(activeNavigator.uuid)
  }
  async function goForward() {
    if (!activeNavigator) return
    window.rife.forward(activeNavigator.uuid)
  }
  function goReload() {
    if (!activeNavigator) return
    window.rife.reload(activeNavigator.uuid)
  }

  let navElement: HTMLElement

  onMount(() => {
    erd.listenTo(navElement, (el: HTMLElement) => {
      // TODO: Send IPC for resize for active navigator
      bounds = el.getBoundingClientRect()
      if (activeNavigator) {
        window.rife.position(activeNavigator.uuid, {x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height-24})
      }
    })
    return () => {
      erd.removeAllListeners(navElement)
      window.rife.unregister(lastActiveNavigatorUUID, handleNavigation)
    }
  })
</script>

<main
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
  ondragover='return false'
>
  <nav>
    <button disabled={!canGoBack} on:click={goBack}>left</button>
    <button disabled={!canGoForward} on:click={goForward}>right</button>
    <button on:click={goReload}>reload</button>
    <input type='search' placeholder='https://...' bind:value={currentURL} />
  </nav>
  <article bind:this={navElement}>
  </article>
</main>

<style>
  nav {
    display: grid;
    grid-template-columns: auto auto auto minmax(0, 1fr);
  }
  article {
    width: 100%;
    height: 100%;
  }
</style>