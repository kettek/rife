<script lang='ts'>
  export let uuids: string[]
  import { dragCount } from './stores/tabs'

  let pendingDragCount = 0
  function handleDragStart(e: DragEvent) {
    if (!e.dataTransfer || !e.target) return
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.setData('text', e.target.dataset.tabuuid)
    pendingDragCount = $dragCount+1
  }
  function handleDragEnd(e: DragEvent) {
    if (!e.dataTransfer || !e.target) return
    console.log('drag end')
    if (pendingDragCount === $dragCount) {
      console.log('successful drop! remove from ourself?')
    }
  }
  //
  function handleDragEnter(e: DragEvent) {
    console.log('drag enter')
  }
  function handleDragLeave(e: DragEvent) {
    console.log('drag leave')
  }
  function handleDrop(e: DragEvent) {
    let uuid = e.dataTransfer?.getData('text')
    if (!uuid) return
    e.preventDefault()
    console.log('drop', uuid, 'at somewhere in list')

    if (uuids.includes(uuid)) {
      console.log('is from ourself')
    } else {
      console.log('is to external')
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
      console.log('is to external')
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
  {#each uuids as uuid}
    <div
      data-tabUUID={uuid}
      draggable=true
      on:dragstart={handleDragStart}
      on:dragend={handleDragEnd}
      on:drop={handleTabDrop}
    >
      {uuid}
    </div>
  {/each}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
  div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>