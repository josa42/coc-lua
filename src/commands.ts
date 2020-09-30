import path from "path"
import fs from "fs"
import { workspace, LanguageClient } from "coc.nvim"
import { installLuaLsp } from "./utils/tools"

export async function version(): Promise<void> {
  const { version } = JSON.parse(fs.readFileSync(path.resolve(__dirname, "..", "package.json"), "utf-8"))
  workspace.showMessage(`Version: ${version}`, "more")
}

export async function updateLuaLsp(client: LanguageClient): Promise<void> {
  await installLuaLsp(true)

  if (client.needsStop()) {
    await client.stop()
    await client.start()
  }
}
