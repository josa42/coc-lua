// https://githb.com/neovim/nvim-lspconfi/blob/e38ff05afc3ad5d4fa8b24b4b0619429125582de/la/nvim_lsp/sumneko_lua.lua

import * as crypto from "crypto"
import * as fs from "fs"
import * as https from "https"
import * as os from "os"
import * as path from "path"
import * as tar from "tar"

import { window } from "coc.nvim"

import { configDir, getConfig } from "./config"
import { showInstallStatus } from "./tools"
import { dbGet, dbSet } from "./db"

const luaLsDir = "sumneko-lua-ls"
const oneDayMS = 24 * 60 * 60 * 1000

const fsp = fs.promises

const osPlatform = os.platform()
const tmpBaseDir = os.tmpdir()

const { join } = path

function releaseDownloadsURL(filePath: string): string {
  return getConfig().installPreReleases
    ? `https://github.com/josa42/coc-lua-binaries/releases/download/latest/${filePath}`
    : `https://github.com/josa42/coc-lua-binaries/releases/latest/download/${filePath}`
}

export async function install(dir: string): Promise<void> {
  const { tarFile } = osEnv()
  await downloadTar(releaseDownloadsURL(tarFile), dir)
}

async function downloadTar(sourceUrl: string, targetPath: string) {
  const dir = await mkTmpDir(sourceUrl)

  const tarTmpPath = join(dir.path, "tmp.tar.gz")

  await download(sourceUrl, tarTmpPath)
  await tar.x({ file: tarTmpPath, cwd: targetPath, strip: 1 })
  await dir.dispose()
}

async function mkTmpDir(key: string): Promise<{ path: string; dispose: () => Promise<void> }> {
  const hash = crypto.createHash("md5").update(key).digest("hex")
  const dir = join(tmpBaseDir, hash)

  await fsp.mkdir(dir, { recursive: true })

  return { path: dir, dispose: async () => fsp.rmdir(dir, { recursive: true }) }
}

async function download(sourceUrl: string, targetPath: string): Promise<void> {
  const file = fs.createWriteStream(targetPath)

  return new Promise((resolve, reject) => {
    const get = (url: string) =>
      https.get(url, (res) => {
        const { statusCode } = res

        if (statusCode === 301 || statusCode === 302) {
          return get(res.headers.location)
        }

        res
          .on("data", (data) => file.write(data))
          .on("end", () => (file.end(), setTimeout(() => resolve(), 5)))
          .on("error", (err: Error) => reject(err))
      })

    return get(sourceUrl)
  })
}

export function osEnv(): { tarFile: string; bin: string } {
  switch (osPlatform) {
    case "darwin":
      return {
        tarFile: "lua-language-server-macos.tar.gz",
        bin: join("bin", "macOS", "lua-language-server"),
      }
    case "linux":
      return {
        tarFile: "lua-language-server-linux.tar.gz",
        bin: join("bin", "Linux", "lua-language-server"),
      }
    case "win32":
      return {
        tarFile: "lua-language-server-windows.tar.gz",
        bin: join("bin", "Windows", "lua-language-server.exe"),
      }
  }
  return { tarFile: "", bin: "" }
}

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
  const { serverPath } = getConfig()

  return [
    serverPath.length > 0 ? serverPath : path.join(baseDir, bin),
    ["-E", path.join(baseDir, "main.lua")],
  ]
}

async function luaLsExists(): Promise<boolean> {
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
