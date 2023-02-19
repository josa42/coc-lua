#!/usr/bin/env node

const fs = require("fs")
const https = require("https")
const path = require("path")

const pkgPath = path.join(__dirname, "..", "package.json")

const rmKey = ["Lua.awakened.cat", "Lua.develop.enable", "Lua.develop.debuggerPort", "Lua.develop.debuggerWait"]

async function run() {
  const settings = fixSchema(JSON.parse(
    await get("https://raw.githubusercontent.com/LuaLS/vscode-lua/master/setting/schema.json")
  ))
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
  const props = pkg.contributes.configuration.properties

  Object.keys(props)
    .filter((k) => k.match(/^Lua\./))
    .sort((a, b) => a.localeCompare(b))
    .forEach((k) => delete props[k])

  rmKey.forEach((k) => delete settings.properties[k])

  Object.assign(props, {
    ...Object.fromEntries(
      Object.entries(settings.properties)
        .filter(([,value]) => !value.properties)
        .map(([key,value]) => [`Lua.${key}`, value])

    )
  })

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
    .filter(([k]) => k.startsWith('Lua.'))
    .sort((p1, p2) => p1[0].localeCompare(p2[0]))
    .flatMap(([k, v]) => {
      const lines = [
      ]

      if (!v.properties) {
        lines.push(`| **\`${k}\`** | ${v?.markdownDescription.trim().split(/\n/).join("<br>") ?? ''} | ${v.default ? JSON.stringify(v.default) : ''} |`)
      }
      return lines
    })

  lines = [
    '| Key | Description | Default |',
    '|-----|-------------|---------|',
    ...lines,
  ]

  sections.find((s) => s.title === "### LuaLS/lua-language-server").lines = ["", ...lines]
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

function fixSchema(schema, base = undefined) {
  base = base ?? schema

  if (schema['$ref']) {
    const [,key,prop] = schema['$ref'].match(/^#\/([^/]+)\/(.*)/) ?? []

    if (!key || !prop || !base[key]?.[prop]) {
      console.log(Object.keys(base[key]))
      throw new Error(`ref / "${prop}" not found: ${schema['$ref']}`)
    }

    return base[key]?.[prop]
  }

  if (schema.properties) {
    Object.entries(schema.properties).forEach(([key, value]) => {
      schema.properties[key] = fixSchema(value, base)
    })
  }

  if (schema.patternProperties) {
    Object.entries(schema.patternProperties).forEach(([key, value]) => {
      if (key === '') {
        delete schema.patternProperties[key]
        key = '.*'
      }

      schema.patternProperties[key] = fixSchema(value, base)
    })
  }

  return schema
}

run()
