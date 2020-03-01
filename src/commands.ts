import path from 'path'
import {workspace, LanguageClient} from 'coc.nvim'
import {installLuaLsp} from './utils/tools'

export async function version(): Promise<void> {
  const v = require(path.resolve(__dirname, '..', 'package.json')).version
  workspace.showMessage(`Version: ${v}`, 'more')
}

export async function updateLuaLsp(client: LanguageClient): Promise<void> {
  await installLuaLsp(true)

  if (client.needsStop()) {
    await client.stop()
    await client.start()
  }
}



