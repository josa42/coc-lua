import path from 'path'
import fs from 'fs'
import {workspace} from 'coc.nvim'
import which from 'which'
import {configDir} from './config'

export async function installLuaLsp(force: boolean = false) {
  if (!force && await luaLspExists()) {
    return
  }
  const baseDir = await configDir('tools')

  await workspace.runTerminalCommand(
    `luarocks install --tree ${baseDir} --server=http://luarocks.org/dev lua-lsp`
  )
}

export async function luaLspBin(): Promise<string> {
  return path.join(await configDir('tools', 'bin'), 'lua-lsp')
}

export async function luaLspExists(): Promise<boolean> {
  const bin = await luaLspBin()
  return new Promise(resolve => fs.open(bin, 'r', (err, _) => resolve(err === null)));
}

export async function commandExists(command: string): Promise<boolean> {
  return new Promise(resolve => which(command, (err, _: string) => resolve(err == null)));
}


