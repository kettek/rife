<script lang='ts'>
  import { mkNavigator } from './interfaces/Navigator'
  import type { NavigatorStack } from './interfaces/Stack'

  import { focusedNavigatorUUID, navigatorStore } from './stores/navigators'
  import { stackStore } from './stores/stacks'

  export let uuids: string[]
  export let stack: NavigatorStack
  export let activeUUID: string
  export let horizontal: boolean = false

  // For the top-level tabs view.
  export let addOnDrop: boolean = true

  $: navigators = stack?.navigatorUUIDs.map(v=>$navigatorStore.find(v2=>v2.uuid===v))

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
    stackStore.addNavigator(stack.uuid, n.uuid, true)
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
  {#if navigators}
    {#each navigators as navigator, index}
      <div
        data-tabUUID={navigator?.uuid}
        data-tabIndex={index}
        draggable=true
        on:dragstart={handleDragStart}
        on:drop={handleTabDrop}
        on:click={handleTabClick}
        class:active={activeUUID===navigator?.uuid}
        class:focused={$focusedNavigatorUUID===navigator?.uuid}
      >
        <img alt={navigator?.title} src={navigator?.favicons[0]}/>
        <span>
          {navigator?.title||'New Tab'}
        </span>
        <aside on:click|stopPropagation|preventDefault={()=>handleTabDelete((navigator?.uuid)??'')}>
          x
        </aside>
      </div>
    {/each}
  {/if}
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
    border: 1px solid transparent;
  }
  div.active {
    background: #666;
  }
  div.focused {
    border: 1px solid blue;
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