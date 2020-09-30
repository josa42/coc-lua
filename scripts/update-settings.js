#!/usr/bin/env node

const fs = require("fs")
const https = require("https")
const path = require("path")

const pkgPath = path.join(__dirname, "..", "package.json")

const rmKey = ["Lua.awakened.cat", "Lua.develop.enable", "Lua.develop.debuggerPort", "Lua.develop.debuggerWait"]

async function run() {
  const settings = JSON.parse(
    await get("https://raw.githubusercontent.com/sumneko/vscode-lua/master/setting/schema.json")
  )
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
  const props = pkg.contributes.configuration.properties

  Object.keys(props)
    .filter((k) => k.match(/^Lua\./))
    .forEach((k) => delete props[k])

  rmKey.forEach((k) => delete settings.properties[k])

  Object.assign(props, settings.properties)

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, "  ") + "\n")
}

async function get(sourceUrl) {
  let reponseData = ""

  return new Promise((resolve, reject) => {
    const get = (url) =>
      https.get(url, (res) => {
        const { statusCode } = res

        if (statusCode === 301 || statusCode === 302) {
          return get(res.headers.location)
        }

        res
          .on("data", (data) => (reponseData += data))
          .on("end", () => resolve(reponseData))
          .on("error", (err) => reject(err))
      })

    return get(sourceUrl)
  })
}

run()
