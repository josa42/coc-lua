import {
  commands,
  ExtensionContext,
  LanguageClient,
  ServerOptions,
  workspace,
  services,
  LanguageClientOptions,
} from "coc.nvim"
import { installLuaLsp, luaLspBin, commandExists } from "./utils/tools"
import { version, updateLuaLsp } from "./commands"
import { setStoragePath } from "./utils/config"

interface LuaConfig {
  enable: boolean
  commandPath: string
}

export async function activate(context: ExtensionContext): Promise<void> {
  setStoragePath(context.storagePath)

  const config = workspace.getConfiguration().get("lua", {}) as LuaConfig
  if (config.enable === false) {
    return
  }

  const [command, args] = config.commandPath ? [config.commandPath, []] : await luaLspBin()

  const useSumnekoLs = workspace.getConfiguration().get("lua.useSumnekoLs", false)
  const name = useSumnekoLs ? "sumneko/lua-language-server" : "Alloyed/lua-lsp"

  if (!(await commandExists(command))) {
    await showInstallStatus(name, async () => {
      await installLuaLsp()
    })
  }

  const serverOptions: ServerOptions = { command, args }

  const clientOptions: LanguageClientOptions = {
    documentSelector: ["lua"],
  }

  const client = new LanguageClient("lua", "lua-lsp", serverOptions, clientOptions)

  context.subscriptions.push(
    services.registLanguageClient(client),
    commands.registerCommand("lua.version", () => version()),
    commands.registerCommand("lua.update.lua-lsp", async () =>
      showInstallStatus(name, async () => await updateLuaLsp(client))
    )
  )
}

async function showInstallStatus(name: string, fn: () => Promise<void>) {
  const statusItem = workspace.createStatusBarItem(90, { progress: true })

  statusItem.text = `Installing '${name}'`
  statusItem.show()

  try {
    await fn()

    workspace.showMessage(`Installed '${name}'`)
  } catch (err) {
    workspace.showMessage(`Failed to install '${name}'`, "error")
  }

  statusItem.hide()
}
