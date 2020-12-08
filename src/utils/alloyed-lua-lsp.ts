import path from "path"
import fs from "fs"
import { workspace, LanguageClient } from "coc.nvim"
import { configDir } from "./config"
import { showInstallStatus } from "./tools"

export async function updateLuaLsp(client: LanguageClient): Promise<void> {
  await installLuaLsp(true)

  if (client.needsStop()) {
    await client.stop()
    client.start()
  }
}

export async function installLuaLsp(force = false): Promise<void> {
  if (!force && (await luaLspExists())) {
    return
  }

  await showInstallStatus("Alloyed/lua-lsp", async () => {
    const baseDir = await configDir("tools")
    let installCmd = `luarocks install --tree ${baseDir} --server=http://luarocks.org/dev lua-lsp`

    const luaVersion = workspace.getConfiguration().get("lua", {})["version"]
    if (luaVersion) {
      installCmd += ` --lua-version=${luaVersion}`
    }

    await workspace.runTerminalCommand(installCmd)
  })
}

export async function luaLspCommand(): Promise<string> {
  const baseDir = await configDir("tools")

  // binary installed by luarocks under Windows has extension '.bat'
  const bin = process.platform === "win32" ? "lua-lsp.bat" : "lua-lsp"

  return path.join(baseDir, "bin", bin)
}

export async function luaLspExists(): Promise<boolean> {
  const bin = await luaLspCommand()
  return new Promise((resolve) => fs.open(bin, "r", (err) => resolve(err === null)))
}
