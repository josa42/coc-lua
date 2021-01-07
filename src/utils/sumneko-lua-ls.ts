import fs from "fs"
import path from "path"
import * as https from "https"

import { window } from "coc.nvim"

import { configDir } from "./config"
import { osEnv, install, releaseDownloadsURL } from "./installer"
import { showInstallStatus } from "./tools"
import { dbGet, dbSet } from "./db"

const luaLsDir = "sumneko-lua-ls"
const oneDayMS = 24 * 60 * 60 * 1000

export async function checkForUpdate(action: "disabled" | "inform" | "ask" | "install"): Promise<void> {
  if (!(await shouldCheck())) {
    return
  }

  const statusItem = window.createStatusBarItem(90, { progress: true })
  statusItem.text = "Check for updates"
  statusItem.show()

  try {
    const rinfo = await getVersionInfo()
    const linfo = await getVersionInstalledInfo()
    if (new Date(rinfo.date) > new Date(linfo.date)) {
      handleUpdateAction(action, rinfo.version)
    }
  } catch (err) {
    window.showMessage(JSON.stringify(err), "error")
  }

  statusItem.hide()
}

async function shouldCheck(): Promise<boolean> {
  const now = new Date().getTime()
  const last = await dbGet("last-update-check", -1)
  const diff = now - last

  if (last === -1 || diff > oneDayMS) {
    await dbSet("last-update-check", now)
    return true
  }

  return false
}

async function handleUpdateAction(action: "disabled" | "inform" | "ask" | "install", version: string) {
  switch (action) {
    case "ask":
      if (await window.showPrompt(`sumneko/lua-language-server ${version} is available. Install?`)) {
        installLuaLs(true)
      }
      break
    case "install":
      installLuaLs(true)
      break
    case "inform":
      window.showMessage(`sumneko/lua-language-server ${version} is available. Run ":CocCommand lua.update"`)
      break
  }
}

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

interface versionInfo {
  date: string
  version: string
  commit: string
}

async function getVersionInstalledInfo(): Promise<versionInfo> {
  try {
    const fpath = path.join(await configDir(luaLsDir), "version.json")
    return JSON.parse(await fs.promises.readFile(fpath, "utf-8"))
  } catch (err) {
    if (err.code !== "ENOENT") {
      window.showMessage(JSON.stringify(err), "error")
    }

    return { date: "", version: "", commit: "" }
  }
}

async function getVersionInfo(): Promise<versionInfo> {
  return new Promise((resolve, reject) => {
    const get = (url: string) =>
      https.get(url, (res) => {
        const { statusCode } = res

        if (statusCode === 301 || statusCode === 302) {
          return get(res.headers.location)
        }

        let out = ""

        res
          .on("data", (data) => (out += data))
          .on("end", () => resolve(JSON.parse(out)))
          .on("error", (err: Error) => reject(err))
      })

    return get(releaseDownloadsURL("version.json"))
  })
}
