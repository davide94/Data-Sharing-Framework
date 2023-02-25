import * as fs from 'fs'
import { PersistenceManager } from './PersistenceManager'
import { LoggingPolicy } from './PDP'

const LOGS_FOLDER = process.env.LOGS_FOLDER!
const LOG_POLICY = process.env.LOG_POLICY!
const REQUEST_ID = process.env.REQUEST_ID!

const parser = new DOMParser()
const logLevel = parser.parseFromString(LOG_POLICY, 'application/xml')
  .documentElement.textContent

fs.watch(LOGS_FOLDER, async (eventType, filename) => {
  const log = fs.readFileSync(filename, { encoding: 'utf-8' })
  if (filter(log)) {
    await PersistenceManager.storeLog(REQUEST_ID, log)
  }
})

const filter = (log: string) => {
  switch (logLevel) {
    case 'ALL':
    case 'HIGH':
    case 'LOW':
      return true
    default:
      return false
  }
}
