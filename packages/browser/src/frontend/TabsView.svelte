<script lang='ts'>
  import { navigatorStore } from './stores/navigators'

  export let uuids: string[]
  export let activeUUID: string
  export let horizontal: boolean = false
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
    if (!e.dataTransfer || !e.target) return
    console.log('drag end')
    if (pendingDragCount === $dragCount) {
      uuids = uuids.filter(v=>v!==pendingDragUUID)
      console.log('successful drop! remove from ourself?')
    }
  }
  //
  function handleDragEnter(e: DragEvent) {
  }
  function handleDragLeave(e: DragEvent) {
  }
  function handleDrop(e: DragEvent) {
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
      {navigator.title||'New Tab'}
    </div>
  {/each}
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  div.active {
    background: #666;
  }
</style>