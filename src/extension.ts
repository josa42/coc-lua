import { commands, ExtensionContext, LanguageClient, ServerOptions, services, LanguageClientOptions } from "coc.nvim"

import { installLuaLs, luaLsCommandAndArgs, checkForUpdate } from "./utils/installer"
import { commandExists } from "./utils/tools"
import { version, update } from "./commands"
import { setStoragePath, getConfig } from "./utils/config"

export async function activate(context: ExtensionContext): Promise<void> {
  setStoragePath(context.storagePath)

  const config = getConfig()
  if (config.enable === false) {
    return
  }

  if (config.checkForUpdates !== "disabled" && config.serverPath.length === 0) {
    setTimeout(() => checkForUpdate(config.checkForUpdates), 0)
  }

  const client = await createClient()

  context.subscriptions.push(
    services.registLanguageClient(client),
    commands.registerCommand("lua.version", () => version()),
    commands.registerCommand("lua.update", async () => update(client))
  )
}

async function createClient(): Promise<LanguageClient> {
  const [command, args] = await luaLsCommandAndArgs()

  if (!(await commandExists(command))) {
    await installLuaLs()
  }

  const serverOptions: ServerOptions = { command, args }

  const clientOptions: LanguageClientOptions = {
    documentSelector: ["lua"],
  }

  return new LanguageClient("lua", "lua", serverOptions, clientOptions)
}
