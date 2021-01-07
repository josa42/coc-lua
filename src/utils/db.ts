import * as fs from "fs"
import * as path from "path"
import { configDir } from "./config"

interface DB {
  [key: string]: any
}

async function dbPath(): Promise<string> {
  const dir = await configDir()
  return path.join(dir, "db.json")
}

async function write(data: DB): Promise<void> {
  await fs.promises.writeFile(await dbPath(), JSON.stringify(data, null, "  "))
}

async function read(): Promise<DB> {
  try {
    return JSON.parse(await fs.promises.readFile(await dbPath(), "utf-8")) as DB
  } catch (err) {
    return {}
  }
}

export async function dbSet<T>(key: string, value: T) {
  const db = await read()
  db[key] = value
  await write(db)
}

export async function dbGet<T>(key: string, defaultValue?: T) {
  const db = await read()
  const value = db[key]

  if (value !== undefined) {
    return value as T
  }

  return defaultValue
}
