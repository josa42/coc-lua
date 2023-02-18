import * as crypto from "crypto"
import * as fs from "fs"
import * as https from "https"
import * as os from "os"
import * as path from "path"
import * as tar from "tar"

import { window } from "coc.nvim"

import { configDir } from "./config"
import { showInstallStatus } from "./tools"
import { dbGet, dbSet } from "./db"

const luaLsDir = "lua-language-server"
const oneDayMS = 24 * 60 * 60 * 1000

const fsp = fs.promises

const osPlatform = os.platform()
const tmpBaseDir = os.tmpdir()

const { join } = path

const latestURL = 'https://api.github.com/repos/LuaLS/lua-language-server/releases/latest'

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../../package.json'), 'utf-8')) as {version: string}

const DBKey = {
  VERSION: 'installed-version',
  PUBLISHED_AT: 'installed-version-published-at',
  LAST_UPDATE_CHECK: "last-update-check",
}

interface LatestResponse {
  tag_name: string
  published_at: string
  assets: Array<{
    name: string
    browser_download_url: string
  }>
}

interface Version {
  version: string
  publishedAt: number
}

interface Release extends Version {
  url: string
}


async function getLatestRelease(filePath: string): Promise<Release> {
  const { assets, tag_name: version, published_at } = await getJSON<LatestResponse>(latestURL)
  const { browser_download_url: url } =  assets.find(({ name }) => name.endsWith(filePath)) ?? {}

  return { version, publishedAt: new Date(published_at).getTime(), url }
}

async function getLatestVersion(): Promise<Version> {
  const { tag_name: version, published_at } = await getJSON<LatestResponse>(latestURL)

  return { version, publishedAt: new Date(published_at).getTime() }
}

export async function install(dir: string): Promise<void> {
  const { tarFile } = osEnv()
  const { url, version, publishedAt } = await getLatestRelease(tarFile)
  await downloadTar(url, dir)
  await dbSet(DBKey.VERSION, version)
  await dbSet(DBKey.PUBLISHED_AT, publishedAt)
}

async function downloadTar(sourceUrl: string, targetPath: string) {
  const dir = await mkTmpDir(sourceUrl)

  if (osPlatform === 'win32') {
    throw new Error('Windows is not currently supported')

  } else {
    const tarTmpPath = join(dir.path, "tmp.tar.gz")

    await download(sourceUrl, tarTmpPath)
    await tar.x({ file: tarTmpPath, cwd: targetPath, strip: 0 })
  }

  await dir.dispose()
}

async function mkTmpDir(key: string): Promise<{ path: string; dispose: () => Promise<void> }> {
  const hash = crypto.createHash("md5").update(key).digest("hex")
  const dir = join(tmpBaseDir, hash)

  await fsp.mkdir(dir, { recursive: true })

  return { path: dir, dispose: async () => fsp.rm(dir, { recursive: true }) }
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
        tarFile: process.arch === 'arm64'
          ? "darwin-arm64.tar.gz"
          : "darwin-x64.tar.gz",
        bin: join("bin", "lua-language-server"),
      }
    case "linux":
      return {
        tarFile: process.arch === 'arm64'
          ? "linux-arm64.tar.gz"
          : "linux-x64.tar.gz",
        bin: join("bin", "lua-language-server"),
      }
    case "win32":
      return {
        tarFile: "win32-x64.zip",
        bin: join("bin", "lua-language-server.exe"),
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
    const rinfo = (await getLatestVersion())
    const linfo = await dbGet<number>(DBKey.PUBLISHED_AT)
    if (rinfo.publishedAt > linfo) {
      handleUpdateAction(action, rinfo.version)
    }
  } catch (err) {
    window.showMessage(JSON.stringify(err), "error")
  }

  statusItem.hide()
}

async function shouldCheck(): Promise<boolean> {
  const now = new Date().getTime()
  const last = await dbGet(DBKey.LAST_UPDATE_CHECK, -1)
  const diff = now - last

  if (last === -1 || diff > oneDayMS) {
    await dbSet(DBKey.LAST_UPDATE_CHECK, now)
    return true
  }

  return false
}

async function handleUpdateAction(action: "disabled" | "inform" | "ask" | "install", version: string) {
  switch (action) {
    case "ask":
      if (await window.showPrompt(`LuaLS/lua-language-server ${version} is available. Install?`)) {
        installLuaLs(true)
      }
      break
    case "install":
      installLuaLs(true)
      break
    case "inform":
      window.showMessage(`LuaLS/lua-language-server ${version} is available. Run ":CocCommand lua.update"`)
      break
  }
}

export async function installLuaLs(force = false): Promise<void> {
  if (!force && (await luaLsExists())) {
    return
  }

  await showInstallStatus("LuaLS/lua-language-server", async () => {
    await install(await configDir(luaLsDir))
  })
}

export async function luaLsCommandAndArgs(): Promise<[string, string[]]> {
  const baseDir = await configDir(luaLsDir)

  const { bin } = osEnv()
  return [path.join(baseDir, bin), ["-E", path.join(baseDir, "main.lua")]]
}

async function luaLsExists(): Promise<boolean> {
  const [bin] = await luaLsCommandAndArgs()
  return new Promise((resolve) => fs.open(bin, "r", (err) => resolve(err === null)))
}

const getOptions = {
    headers: {
        'User-Agent': `coc-lua/${pkg.version}`,
    }
}

async function getJSON<R>(url: string): Promise<R> {
  return new Promise((resolve, reject) => {
    https
      .get(url, getOptions, (resp) => {
        let data = ""

        resp.on("data", (chunk) => (data += chunk))
        resp.on("end", () => {
          resolve(JSON.parse(data) as R)
        })
      })
      .on("error", (err) => reject(err))
  })
}
