import fs from 'fs'
import path from 'path'
import {workspace} from 'coc.nvim';

interface State {
  storagePath?: string
}

let state: State = {}

export function setStoragePath(dir: string): void {
  state.storagePath = dir
}

export async function configDir(...names: string[]): Promise<string> {
  const storage = state.storagePath || (() => {
    const home = require('os').homedir()
    return path.join(home, '.config', 'coc', 'lua')
  })()

  const dir = path.join(storage, ...names)

  return new Promise((resolve) => {
    fs.mkdirSync(dir, {recursive: true})
    resolve(dir)
  })

}
