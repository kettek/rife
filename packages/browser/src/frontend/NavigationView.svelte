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

  import { dragCount } from './stores/tabs'

  export let stack: NavigatorStack
  let activeNavigator: Navigator | undefined
  let bounds = new DOMRect(0,0,0,0)
  $: activeNavigator = $navigatorStore.find(v=>v.uuid===stack.activeNavigatorUUID)

  let lastActiveNavigatorUUID: string = ''
  $: {
    if (stack.activeNavigatorUUID !== lastActiveNavigatorUUID) {
      console.log('hide', lastActiveNavigatorUUID)
      ;(globalThis as any).navigation.hide(lastActiveNavigatorUUID)

      ;(globalThis as any).navigation.position(stack.activeNavigatorUUID, {x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height})

      ;(globalThis as any).navigation.show(stack.activeNavigatorUUID)

      console.log('show', stack.activeNavigatorUUID)

      lastActiveNavigatorUUID = stack.activeNavigatorUUID
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
  let navElement: HTMLElement

  onMount(() => {
    erd.listenTo(navElement, (el: HTMLElement) => {
      // TODO: Send IPC for resize for active navigator
      bounds = el.getBoundingClientRect()
      if (activeNavigator) {
        ;(globalThis as any).navigation.position(activeNavigator.uuid, {x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height-18})
      }
    })
    return () => {
      erd.removeAllListeners(navElement)
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
    <button>left</button>
    <button>right</button>
    <button>reload</button>
    <input type='search' placeholder='https://...'/>
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