import { ipcRenderer } from 'electron'

let thisUUID:string
ipcRenderer.on('uuid', (_: Electron.IpcRendererEvent, uuid: string) => {
  thisUUID = uuid
})

document.addEventListener('drop', (e: DragEvent) => {
  let sideWidth = window.innerWidth / 5
  let sideHeight = window.innerHeight / 5

  let centerWidth = window.innerWidth - sideWidth
  let centerHeight = window.innerHeight - sideHeight

  // TODO: Make side detection more intelligent.
  let side = 'center'

  let sideX = 'center'
  if (e.x < sideWidth) {
    sideX = 'left'
  } else if (e.x > centerWidth) {
    sideX = 'right'
  }
  let sideY = 'center'
  if (e.y < sideHeight) {
    sideY = 'top'
  } else if (e.y > centerHeight) {
    sideY = 'bottom'
  }

  if (sideY !== 'center') {
    side = sideY
  }
  if (sideX !== 'center') {
    side = sideX
  }

  let uuid = e.dataTransfer?.getData('x-rife-tab')
  if (!uuid) return
  ipcRenderer.send('rife', {
    type: 'move',
    uuid,
    toContainerOf: thisUUID,
    side,
  })
  e.preventDefault()
  e.stopPropagation()
})

document.addEventListener('dragenter', (e: DragEvent) => {
  if (!e.dataTransfer?.types.includes('x-rife-tab')) return
  e.preventDefault()
  e.stopPropagation()
})

document.addEventListener('dragover', (e: DragEvent) => {
  if (!e.dataTransfer?.types.includes('x-rife-tab')) return
  e.preventDefault()
  e.stopPropagation()
})


export {}