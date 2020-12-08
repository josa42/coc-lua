import fs from "fs"
import path from "path"
import { getConfig } from "./utils/config"
import { installLuaLs } from "./utils/sumneko-lua-ls"
import { installLuaLsp } from "./utils/alloyed-lua-lsp"
import { workspace, LanguageClient } from "coc.nvim"

export async function version(): Promise<void> {
  const { version } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf-8"))
  workspace.showMessage(`coc-lua: ${version}`, "more")
}

export async function update(client: LanguageClient): Promise<void> {
  if (getConfig().useSumnekoLs) {
    await installLuaLs(true)
  } else {
    await installLuaLsp(true)
  }

  if (client.needsStop()) {
    await client.stop()
    client.start()
  }
}
