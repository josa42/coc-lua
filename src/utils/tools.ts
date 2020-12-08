import which from "which"
import { workspace } from "coc.nvim"

export async function commandExists(bin: string): Promise<boolean> {
  return new Promise((resolve) => which(bin, (err) => resolve(err == null)))
}

export async function showInstallStatus(name: string, fn: () => Promise<void>): Promise<void> {
  const statusItem = workspace.createStatusBarItem(90, { progress: true })

  statusItem.text = `Installing '${name}'`
  statusItem.show()

  try {
    await fn()
    workspace.showMessage(`Installed '${name}'`)
  } catch (err) {
    workspace.showMessage(`Failed to install '${name}': ${err}`, "error")
    statusItem.hide()
    throw err
  }

  statusItem.hide()
}
