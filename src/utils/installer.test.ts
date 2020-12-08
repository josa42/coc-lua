import * as fs from "fs"
import * as path from "path"
import * as os from "os"

import { install, osEnv } from "./installer"

describe("installer", () => {
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), "foo-"))
  })

  afterEach(async () => {
    await fs.promises.rmdir(tmpDir, { recursive: true })
  })

  it("should install", async () => {
    jest.setTimeout(30000)

    await install(tmpDir)

    const { bin } = osEnv()

    expect(fs.existsSync(path.join(tmpDir, "main.lua"))).toBeTruthy()
    expect(fs.existsSync(path.join(tmpDir, bin))).toBeTruthy()
  })
})
