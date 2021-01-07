// https://githb.com/neovim/nvim-lspconfi/blob/e38ff05afc3ad5d4fa8b24b4b0619429125582de/la/nvim_lsp/sumneko_lua.lua

import * as crypto from "crypto"
import * as fs from "fs"
import * as https from "https"
import * as os from "os"
import * as path from "path"
import * as tar from "tar"

import { getConfig } from "./config"

const fsp = fs.promises

const osPlatform = os.platform()
const tmpBaseDir = os.tmpdir()

const { join } = path

export function releaseDownloadsURL(filePath: string): string {
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
