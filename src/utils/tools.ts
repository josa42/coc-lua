import which from "which"
import { window } from "coc.nvim"

export async function commandExists(bin: string): Promise<boolean> {
  return Boolean(await which(bin, { nothrow: true }))
}

export async function showInstallStatus(name: string, fn: () => Promise<void>): Promise<void> {
  const statusItem = window.createStatusBarItem(90, { progress: true })

  statusItem.text = `Installing '${name}'`
  statusItem.show()

  try {
    await fn()
    window.showMessage(`Installed '${name}'`)
  } catch (err) {
    window.showMessage(`Failed to install '${name}': ${err}`, "error")
    statusItem.hide()
    throw err
  }

  statusItem.hide()
}
