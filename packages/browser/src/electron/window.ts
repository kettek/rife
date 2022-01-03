import { BrowserWindow } from "electron"

export let mainWindow: BrowserWindow | null

export function setMainWindow(w: BrowserWindow|null) {
  mainWindow = w
}