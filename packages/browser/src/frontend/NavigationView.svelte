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
  import { isNavigationShowEvent, NavigationEvent } from '../api/navigation'
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
  let currentTitle: string = ''
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
    let navigator = $navigatorStore.find(v=>v.uuid===o.uuid)
    if (!navigator) return
    if (isNavigationNavigateEvent(o)) {
      navigator.title = o.title
      navigator.url = o.url
      currentURL = o.url
      currentTitle = o.title
      canGoBack = await window.rife.back(navigator.uuid, true)
      canGoForward = await window.rife.forward(navigator.uuid, true)
    } else if (isNavigationShowEvent(o)) {
      navigator.title = o.title
      navigator.url = o.url
      currentTitle = o.title
      currentURL = o.url
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

  function handleSearchKeyup(e: KeyboardEvent) {
    if (!activeNavigator) return
    if (e.code === 'Enter') {
      // FIXME: We should maintain the old URL here and only adjust the actual request.
      try {
        new URL(currentURL)
      } catch(e: any) {
        currentURL = 'https://'+currentURL
      }
      window.rife.navigate(activeNavigator.uuid, currentURL)
    }
  }
  function handleSearchFocus(e: MouseEvent) {
    if (e.button !== 0) return

    let target = <HTMLInputElement>(e.target)

    if (document.activeElement === target) return
    
    let hasMoved = false
    let mouseup = (e2: MouseEvent) => {
      if (e2.button !== 0) return
      if (!hasMoved) {
        target.setSelectionRange(0, target.value.length)
      }
      window.removeEventListener('mousemove', mousemove)
      window.removeEventListener('mouseup', mouseup)
    }
    let mousemove = (_: MouseEvent) => {
      hasMoved = true
    }

    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)
  }
  function handleSearchBlur(e: FocusEvent) {
    let target = <HTMLInputElement>(e.target)
    target.setSelectionRange(0, 0)

    // For some ridiculuous reason, we need to call blur on the activeElement if we remove focus by clicking on a BrowserView.
    document.activeElement?.blur()
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
  function goDevtools() {
    if (!activeNavigator) return
    window.rife.toggleDevtools(activeNavigator.uuid)
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
    <input type='search' placeholder='https://...' bind:value={currentURL} on:keyup={handleSearchKeyup} on:mousedown={handleSearchFocus} on:blur={handleSearchBlur}/>
    <button on:click={goDevtools}>dev</button>
  </nav>
  <article bind:this={navElement}>
  </article>
</main>

<style>
  nav {
    display: grid;
    grid-template-columns: auto auto auto minmax(0, 1fr) auto;
  }
  article {
    width: 100%;
    height: 100%;
  }
</style>