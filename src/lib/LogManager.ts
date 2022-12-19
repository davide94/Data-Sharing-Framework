import * as fs from 'fs'
import { PersistenceManager } from './PersistenceManager'

const LOGS_FOLDER = process.env.LOGS_FOLDER!

fs.watch(LOGS_FOLDER, async (eventType, filename) => {
  const log = fs.readFileSync(filename, { encoding: 'utf-8' })
  await PersistenceManager.storeLogs(log)
})
