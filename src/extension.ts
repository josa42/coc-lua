import { commands, ExtensionContext, LanguageClient, ServerOptions, workspace, services, LanguageClientOptions } from 'coc.nvim'
import { installLuaLsp, luaLspBin, commandExists } from './utils/tools'
import { version, updateLuaLsp } from './commands'

export async function activate(context: ExtensionContext): Promise<void> {

  const config = workspace.getConfiguration().get('lua', {}) as any
  if (config.enable === false) {
    return
  }

  const command = config.commandPath || await luaLspBin()
  if (!await commandExists(command)) {
    await installLuaLsp()
  }

  const serverOptions: ServerOptions = { command }

  const clientOptions: LanguageClientOptions = {
    documentSelector: ['lua']
  }

  const client = new LanguageClient('lua', 'lua-lsp', serverOptions, clientOptions)

  context.subscriptions.push(
    services.registLanguageClient(client),
    commands.registerCommand("lua.version", () => version()),
    commands.registerCommand("lua.update.lua-lsp", () => updateLuaLsp(client)),
  )
}


