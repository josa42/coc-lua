import path from "path"
import fs from "fs"
import { workspace } from "coc.nvim"
import { configDir, getConfig } from "./config"
import { commandExists, showInstallStatus } from "./tools"

const luaLspDir = "alloyed-lua-lsp"

export async function installLuaLsp(force = false): Promise<void> {
  if (!force && (await luaLspExists())) {
    return
  }

  await showInstallStatus("Alloyed/lua-lsp", async () => {
    const baseDir = await configDir(luaLspDir)
    let installCmd = `luarocks install --tree ${baseDir} --server=http://luarocks.org/dev lua-lsp`

    const luaVersion = getConfig().version
    if (luaVersion) {
      installCmd += ` --lua-version=${luaVersion}`
    }

    await workspace.runTerminalCommand(installCmd)
  })
}

export async function luaLspCommand(): Promise<string> {
  const baseDir = await configDir(luaLspDir)

  // binary installed by luarocks under Windows has extension '.bat'
  const bin = process.platform === "win32" ? "lua-lsp.bat" : "lua-lsp"

  return path.join(baseDir, "bin", bin)
}

export async function luaLspExists(): Promise<boolean> {
  const bin = await luaLspCommand()
  return new Promise((resolve) => fs.open(bin, "r", (err) => resolve(err === null)))
}
