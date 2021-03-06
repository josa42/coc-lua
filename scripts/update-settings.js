#!/usr/bin/env node

const fs = require("fs")
const https = require("https")
const path = require("path")

const pkgPath = path.join(__dirname, "..", "package.json")

const rmKey = ["Lua.awakened.cat", "Lua.develop.enable", "Lua.develop.debuggerPort", "Lua.develop.debuggerWait"]

async function run() {
  const settings = fixSchema(JSON.parse(
    await get("https://raw.githubusercontent.com/sumneko/vscode-lua/master/setting/schema.json")
  ))
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
  const props = pkg.contributes.configuration.properties

  Object.keys(props)
    .filter((k) => k.match(/^Lua\./))
    .sort((a, b) => a.localeCompare(b))
    .forEach((k) => delete props[k])

  rmKey.forEach((k) => delete settings.properties[k])

  Object.assign(props, settings.properties)

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, "  ") + "\n")

  const sections = parseMarkdown(await fs.promises.readFile(path.join(__dirname, "..", "README.md"), "utf-8"))
  await updateTable(sections)

  const out = sections.flatMap(({ title, lines }) => [title, ...lines]).join("\n")
  await fs.promises.writeFile(path.join(__dirname, "..", "README.md"), out)
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

async function updateTable(sections) {
  const pkg = JSON.parse(await fs.promises.readFile(path.join(__dirname, "..", "package.json")))

  let lines = Object.entries(pkg.contributes.configuration.properties)
    .filter(([k]) => k.match(/^Lua/))
    .sort((p1, p2) => p1[0].localeCompare(p2[0]))
    .flatMap(([k, v]) => {
      const lines = []
      lines.push(`- **\`${k}\`**` + (v.default !== undefined ? ` [Default: \`${JSON.stringify(v.default)}\`]  ` : "  "))
      if (v.markdownDescription) {
        lines.push("  " + v.markdownDescription.trim().split(/\n/).join("\n  "))
        lines.push("")
      }
      return lines
    })

  sections.find((s) => s.title === "### sumneko/lua-language-server").lines = ["", ...lines]
}

function parseMarkdown(source) {
  let section

  return source.split("\n").reduce((sections, line) => {
    if (line.startsWith("#")) {
      section = { title: line, lines: [] }
      sections.push(section)
    } else {
      section.lines.push(line)
    }

    return sections
  }, [])
}

function fixSchema(schema) {

  if (schema.properties) {
    Object.entries(schema.properties).forEach(([key, value]) => {
      schema.properties[key] = fixSchema(value)
    })
  }

  if (schema.patternProperties) {
    Object.entries(schema.patternProperties).forEach(([key, value]) => {
      if (key === '') {
        delete schema.patternProperties[key]
        key = '.*'
      }

      schema.patternProperties[key] = fixSchema(value)
    })
  }

  return schema
}

run()
