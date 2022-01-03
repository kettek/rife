<script lang='ts'>
import type { NavigatorStack } from './interfaces/Stack';
import { navigatorStore } from './stores/navigators';

  import { dragCount } from './stores/tabs'

  export let stack: NavigatorStack
  $: activeNavigator = $navigatorStore.find(v=>v.uuid===stack.activeNavigatorUUID)

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
  <article>
    {#if activeNavigator}
      {activeNavigator.uuid}
    {:else}
      no active navigator
    {/if}
  </article>
</main>

<style>
  nav {
    display: grid;
    grid-template-columns: auto auto auto minmax(0, 1fr);
  }
</style>