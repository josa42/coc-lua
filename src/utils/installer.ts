// https://githb.com/neovim/nvim-lspconfi/blob/e38ff05afc3ad5d4fa8b24b4b0619429125582de/la/nvim_lsp/sumneko_lua.lua

import crypto from "crypto"
import fs from "fs"
import fsp from "fs/promises"
import https from "https"
import os from "os"
import path from "path"
import unzipper from "unzipper"
import { exec } from "child_process"

const ninjaVersion = "v1.9.0"
const osPlatform = os.platform()
const tmpBaseDir = os.tmpdir()

const { join } = path

export async function install(dir: string): Promise<void> {
  const { path: tmpDir, dispose } = await mkTmpDir("coc-lua")
  const { ninjaZip, buildFile } = osEnv()

  const ninjaUrl = `https://github.com/ninja-build/ninja/releases/download/${ninjaVersion}/${ninjaZip}`
  const llsUrl = "https://github.com/sumneko/lua-language-server.git"

  const binDir = join(tmpDir, "bin")
  const llsDir = join(tmpDir, "lua-ls")

  const env = { ...process.env, PATH: `${process.env.PATH}:${binDir}` }

  // Install ninja
  await downloadZip(ninjaUrl, binDir)
  await fsp.chmod(join(binDir, "ninja"), 0o755)

  // clone
  await sh(`git clone "${llsUrl}" "${llsDir}"`)
  await sh("git submodule update --init --recursive", { cwd: llsDir })

  // build
  await sh(`ninja -f ${join("ninja", buildFile)}`, { cwd: join(llsDir, "3rd", "luamake"), env })
  await sh(`${join(llsDir, "3rd", "luamake", "luamake")} rebuild`, { cwd: llsDir, env })

  // copy files
  for (const p of ["bin", "libs", "locale", "script", "main.lua", "platform.lua"]) {
    await copy(join(llsDir, p), join(dir, p))
  }

  await dispose()
}

async function downloadZip(sourceUrl: string, targetPath: string) {
  const dir = await mkTmpDir(sourceUrl)

  const zipTmpPath = join(dir.path, "tmp.zip")

  await download(sourceUrl, zipTmpPath)
  await extractZip(zipTmpPath, targetPath)
  await dir.dispose()
}

async function mkTmpDir(key: string): Promise<{ path: string; dispose: () => Promise<void> }> {
  const hash = crypto.createHash("md5").update(key).digest("hex")
  const dir = join(tmpBaseDir, hash)

  await fsp.mkdir(dir, { recursive: true })

  return { path: dir, dispose: async () => fsp.rmdir(dir, { recursive: true }) }
}

async function download(sourceUrl: string, targetPath: string) {
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
          .on("end", () => (file.end(), resolve()))
          .on("error", (err) => reject(err))
      })

    return get(sourceUrl)
  })
}

export function osEnv(): { ninjaZip: string; buildFile: string; bin: string } {
  switch (osPlatform) {
    case "darwin":
      return {
        ninjaZip: "ninja-mac.zip",
        buildFile: "macos.ninja",
        bin: join("bin", "macOS", "lua-language-server"),
      }
    case "linux":
      return {
        ninjaZip: "ninja-linux.zip",
        buildFile: "linux.ninja",
        bin: join("bin", "macOS", "lua-language-server"),
      }
    case "win32":
      return {
        ninjaZip: "ninja-win.zip",
        buildFile: "msvc.ninja",
        bin: join("bin", "macOS", "lua-language-server.exe"),
      }
  }
  return { ninjaZip: "", buildFile: "", bin: "" }
}

async function extractZip(zipPath: string, outputPath: string) {
  return new Promise((resolve) => {
    const extract = unzipper.Extract({ path: outputPath })
    extract.on("close", resolve)

    fs.createReadStream(zipPath).pipe(extract)
  })
}

async function sh(cmd: string, options?: { cwd?: string; env?: { [key: string]: string } }): Promise<[string, string]> {
  return new Promise((resolve, reject) => {
    exec(cmd, options || {}, (err: Error, stdout: string, stderr: string) => {
      if (err !== null) {
        return reject(err)
      }

      resolve([stdout as string, stderr as string])
    })
  })
}

async function copy(src: string, dest: string) {
  try {
    const isDirectory = (await fsp.stat(src)).isDirectory()
    if (isDirectory) {
      await fsp.mkdir(dest, { recursive: true })

      for (const file of await fsp.readdir(src)) {
        await copy(join(src, file), join(dest, file))
      }
    } else {
      await fsp.copyFile(src, dest)
    }
  } catch (err) {
    // empty
  }
}
