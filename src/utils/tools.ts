import path from "path"
import fs from "fs"
import { workspace } from "coc.nvim"
import which from "which"
import { configDir } from "./config"
import { osEnv, install } from "./installer"

const lspDir = "sumneko_lua"

export async function installLuaLsp(force = false): Promise<void> {
  if (!force && (await luaLspExists())) {
    return
  }

  const useSumnekoLs = workspace.getConfiguration().get("lua.useSumnekoLs", false)
  if (useSumnekoLs) {
    return install(await configDir("tools", lspDir))
  }

  const baseDir = await configDir("tools")
  let installCmd = `luarocks install --tree ${baseDir} --server=http://luarocks.org/dev lua-lsp`

  const luaVersion = workspace.getConfiguration().get("lua", {})["version"]
  if (luaVersion) {
    installCmd += ` --lua-version=${luaVersion}`
  }

  await workspace.runTerminalCommand(installCmd)
}

export async function luaLspBin(): Promise<[string, string[]]> {
  const baseDir = await configDir("tools")

  const useSumnekoLs = workspace.getConfiguration().get("lua.useSumnekoLs", false)
  if (useSumnekoLs) {
    const { bin } = osEnv()
    return [path.join(baseDir, lspDir, bin), ["-E", path.join(baseDir, lspDir, "main.lua")]]
  }

  // binary installed by luarocks under Windows has extension '.bat'
  const bin = process.platform === "win32" ? "lua-lsp.bat" : "lua-lsp"

  return [path.join(baseDir, "bin", bin), []]
}

export async function luaLspExists(): Promise<boolean> {
  const [bin] = await luaLspBin()
  return new Promise((resolve) => fs.open(bin, "r", (err) => resolve(err === null)))
}

export async function commandExists(command: string): Promise<boolean> {
  return new Promise((resolve) => which(command, (err) => resolve(err == null)))
}
