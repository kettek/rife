<script lang='ts'>
  import { mkNavigator } from './interfaces/Navigator'
  import type { NavigatorStack } from './interfaces/Stack'

  import { navigatorStore } from './stores/navigators'
  import { stackStore } from './stores/stacks'

  export let uuids: string[]
  export let stack: NavigatorStack
  export let activeUUID: string
  export let horizontal: boolean = false

  // For the top-level tabs view.
  export let removeOnDrag: boolean = true
  export let addOnDrop: boolean = true

  $: navigators = $navigatorStore.filter(v=>uuids.includes(v.uuid))

  function handleDragStart(e: DragEvent) {
    if (!e.dataTransfer || !e.target) return
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.setData('x-rife-tab', e.target.dataset.tabuuid)
  }
  //
  function handleDragEnter(e: DragEvent) {
  }
  function handleDragLeave(e: DragEvent) {
  }
  function handleDrop(e: DragEvent) {
    if (!addOnDrop) return
    let uuid = e.dataTransfer?.getData('x-rife-tab')
    if (!uuid) return
    e.preventDefault()
    e.stopPropagation()

    stackStore.move({
      uuid,
      container: stack.uuid,
      side: 'center',
    })
  }

  function handleTabDrop(e: DragEvent) {
    if (!addOnDrop) return
    let uuid = e.dataTransfer?.getData('x-rife-tab')
    if (!uuid) return
    e.preventDefault()
    e.stopPropagation()
    stackStore.move({
      uuid,
      container: stack.uuid,
      side: 'center',
    })
  }
  function handleTabClick(e: MouseEvent) {
    activeUUID = e.target.dataset.tabuuid
  }
  function handleTabDelete(uuid: string) {
    navigatorStore.remove(uuid)
    stackStore.removeNavigator(uuid)
  }
  function handleTabAdd() {
    let n = mkNavigator()
    navigatorStore.add(n)
    uuids.push(n.uuid)
    uuids = [...uuids]
    // Auto-switch to new tab.
    activeUUID = n.uuid
  }
  function handleTabsDelete() {
    for (let uuid of uuids) {
      navigatorStore.remove(uuid)
    }
    stackStore.delete(stack.uuid)
  }
</script>

<main
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
  ondragover='return false'
  class:horizontal
>
  {#each navigators as navigator}
    <div
      data-tabUUID={navigator.uuid}
      draggable=true
      on:dragstart={handleDragStart}
      on:drop={handleTabDrop}
      on:click={handleTabClick}
      class:active={activeUUID===navigator.uuid}
    >
      <img alt={navigator.title} src={navigator.favicons[0]}/>
      <span>
        {navigator.title||'New Tab'}
      </span>
      <aside on:click|stopPropagation|preventDefault={()=>handleTabDelete(navigator.uuid)}>
        x
      </aside>
    </div>
  {/each}
  <div on:click={handleTabAdd}>
    +
  </div>
  {#if stack}
    <div on:click={handleTabsDelete}>
      x
    </div>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
  main.horizontal {
    flex-direction: row;
  }
  div {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
  }
  div.active {
    background: #666;
  }
  img {
    max-height: 16px;
    max-width: 16px;
    object-fit: contain;
    pointer-events: none;
  }
  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    pointer-events: none;
  }
</style>