import fs from "fs"
import path from "path"
import { installLuaLs } from "./utils/sumneko-lua-ls"
import { window, LanguageClient } from "coc.nvim"

export async function version(): Promise<void> {
  const { version } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf-8"))
  window.showMessage(`coc-lua: ${version}`, "more")
}

export async function update(client: LanguageClient): Promise<void> {
  await installLuaLs(true)

  if (client.needsStop()) {
    await client.stop()
    client.start()
  }
}
