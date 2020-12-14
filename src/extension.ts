import {
  commands,
  ExtensionContext,
  LanguageClient,
  ServerOptions,
  workspace,
  services,
  LanguageClientOptions,
} from "coc.nvim"

import { installLuaLsp, luaLspCommand } from "./utils/alloyed-lua-lsp"
import { installLuaLs, luaLsCommandAndArgs, checkForUpdate } from "./utils/sumneko-lua-ls"

import { commandExists } from "./utils/tools"
import { version, update } from "./commands"
import { setStoragePath, getConfig } from "./utils/config"

export async function activate(context: ExtensionContext): Promise<void> {
  setStoragePath(context.storagePath)

  const config = getConfig()
  if (config.enable === false) {
    return
  }

  if (config.useSumnekoLs && config.checkForUpdates !== "disabled") {
    setTimeout(() => checkForUpdate(config.checkForUpdates), 0)
  }

  const client = config.useSumnekoLs
    ? await createClientSumnekoLs(context, config)
    : await createClientAlloyedLsp(context, config)

  context.subscriptions.push(
    services.registLanguageClient(client),
    commands.registerCommand("lua.version", () => version()),
    commands.registerCommand("lua.update", async () => update(client))
  )
}

// TODO deprecate and remove once sumneko/lua-language-server is stable
async function createClientAlloyedLsp(context, config): Promise<LanguageClient> {
  const command = config.commandPath || (await luaLspCommand())

  if (!(await commandExists(command))) {
    await installLuaLsp()
  }

  const serverOptions: ServerOptions = { command }

  const clientOptions: LanguageClientOptions = {
    documentSelector: ["lua"],
  }

  return new LanguageClient("lua", "lua", serverOptions, clientOptions)
}

async function createClientSumnekoLs(context, config): Promise<LanguageClient> {
  if (config.commandPath) {
    workspace.showMessage(
      "[coc-lua] Wrong configuration: Cannot use both lua.commandPath and lua.useSumnekoLs",
      "warning"
    )
  }

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
