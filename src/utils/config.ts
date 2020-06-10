import fs from 'fs'
import os from 'os'
import path from 'path'

interface State {
  storagePath?: string
}

const state: State = {}

export function setStoragePath(dir: string): void {
  state.storagePath = dir
}

export async function configDir(...names: string[]): Promise<string> {
  const storage = state.storagePath || ((): string => {
    const home = os.homedir()
    return path.join(home, '.config', 'coc', 'lua')
  })()

  const dir = path.join(storage, ...names)

  return new Promise((resolve) => {
    fs.mkdirSync(dir, {recursive: true})
    resolve(dir)
  })

}
