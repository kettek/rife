<script lang='ts'>
  import { mkNavigator } from './interfaces/Navigator'

  import { navigatorStore } from './stores/navigators'

  export let uuids: string[]
  export let activeUUID: string
  export let horizontal: boolean = false

  // For the top-level tabs view.
  export let removeOnDrag: boolean = true
  export let addOnDrop: boolean = true

  import { dragCount } from './stores/tabs'

  $: navigators = $navigatorStore.filter(v=>uuids.includes(v.uuid))

  let pendingDragCount = 0
  let pendingDragUUID: string = ''
  function handleDragStart(e: DragEvent) {
    if (!e.dataTransfer || !e.target) return
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.setData('text', e.target.dataset.tabuuid)
    pendingDragUUID = e.target.dataset.tabuuid
    pendingDragCount = $dragCount+1
  }
  function handleDragEnd(e: DragEvent) {
    if (!removeOnDrag) return
    if (!e.dataTransfer || !e.target) return
    console.log('drag end')
    if (pendingDragCount === $dragCount) {
      uuids = uuids.filter(v=>v!==pendingDragUUID)
    }
  }
  //
  function handleDragEnter(e: DragEvent) {
  }
  function handleDragLeave(e: DragEvent) {
  }
  function handleDrop(e: DragEvent) {
    if (!addOnDrop) return
    let uuid = e.dataTransfer?.getData('text')
    if (!uuid) return
    e.preventDefault()
    e.stopPropagation()
    console.log('drop', uuid, 'at somewhere in list')

    if (uuids.includes(uuid)) {
      console.log('is from ourself')
    } else {
      console.log('is from external')
      uuids.push(uuid)
      uuids = uuids
      $dragCount++
    }
  }

  function handleTabDrop(e: DragEvent) {
    if (!addOnDrop) return
    let uuid = e.dataTransfer?.getData('text')
    if (!uuid) return
    e.preventDefault()
    e.stopPropagation()
    console.log('drop', uuid, ' on/after', e.target.dataset.tabuuid)
    if (uuids.includes(uuid)) {
      console.log('is from ourself')
    } else {
      console.log('is from external')
      uuids.push(uuid)
      uuids = uuids
      $dragCount++
    }
  }
  function handleTabClick(e: MouseEvent) {
    activeUUID = e.target.dataset.tabuuid
  }
  function handleTabDelete(uuid: string) {
    navigatorStore.remove(uuid)
    uuids = uuids.filter(v=>v!==uuid)
  }
  function handleTabAdd() {
    let n = mkNavigator()
    navigatorStore.add(n)
    uuids.push(n.uuid)
    uuids = [...uuids]
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
      on:dragend={handleDragEnd}
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