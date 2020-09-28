import path from 'path'
import fs from 'fs'
import {workspace} from 'coc.nvim'
import which from 'which'
import {configDir} from './config'

export async function installLuaLsp(force = false): Promise<void> {
  if (!force && await luaLspExists()) {
    return
  }
  const baseDir = await configDir('tools')
  let installCmd = `luarocks install --tree ${baseDir} --server=http://luarocks.org/dev lua-lsp`

  const luaVersion = workspace.getConfiguration().get('lua', {})['version']
  if(luaVersion) {
    installCmd += ` --lua-version=${luaVersion}`
  }

  await workspace.runTerminalCommand(installCmd)
}

export async function luaLspBin(): Promise<string> {
  return path.join(await configDir('tools', 'bin'), 'lua-lsp')
}

export async function luaLspExists(): Promise<boolean> {
  const bin = await luaLspBin()
  return new Promise(resolve => fs.open(bin, 'r', (err) => resolve(err === null)))
}

export async function commandExists(command: string): Promise<boolean> {
  return new Promise(resolve => which(command, (err) => resolve(err == null)))
}


