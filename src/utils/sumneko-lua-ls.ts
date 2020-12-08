import fs from "fs"
import path from "path"
import { configDir } from "./config"
import { osEnv, install } from "./installer"
import { showInstallStatus } from "./tools"

const luaLsDir = "sumneko-lua-ls"

export async function installLuaLs(force = false): Promise<void> {
  if (!force && (await luaLsExists())) {
    return
  }

  await showInstallStatus("sumneko/lua-language-server", async () => {
    await install(await configDir(luaLsDir))
  })
}

export async function luaLsCommandAndArgs(): Promise<[string, string[]]> {
  const baseDir = await configDir(luaLsDir)

  const { bin } = osEnv()
  return [path.join(baseDir, bin), ["-E", path.join(baseDir, "main.lua")]]
}

export async function luaLsExists(): Promise<boolean> {
  const [bin] = await luaLsCommandAndArgs()
  return new Promise((resolve) => fs.open(bin, "r", (err) => resolve(err === null)))
}
