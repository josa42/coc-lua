import fs from "fs"
import path from "path"
import { getConfig } from "./utils/config"
import { installLuaLs } from "./utils/sumneko-lua-ls"
import { installLuaLsp } from "./utils/alloyed-lua-lsp"
import { workspace, LanguageClient } from "coc.nvim"

export async function version(): Promise<void> {
  const { version } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf-8"))
  workspace.showMessage(`Version: ${version}`, "more")
}

export async function update(client: LanguageClient): Promise<void> {
  const config = getConfig()

  if (config.useSumnekoLs) {
    await installLuaLs(true)
  } else {
    await installLuaLsp(true)
  }

  if (client.needsStop()) {
    await client.stop()
    await client.start()
  }
}
