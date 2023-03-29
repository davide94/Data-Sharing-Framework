import {WatchEventType} from "fs";

const fs = require('fs')
const {PersistenceManager} = require('./PersistenceManager')

const REQUEST_ID = process.env.REQUEST_ID
const LOGS_FOLDER = process.env.LOGS_FOLDER
const LOGS_LEVEL = process.env.LOGS_LEVEL ?? 'ALL'

console.log(LOGS_FOLDER)

fs.watch(LOGS_FOLDER, async (eventType: WatchEventType, filename: string) => {
  console.log({eventType, filename})

  const log = fs.readFileSync(filename, { encoding: 'utf-8' })
  if (filter(log)) {
    await PersistenceManager.storeLog(REQUEST_ID, log)
  }
})

const filter = (log: any) => {
  switch (LOGS_LEVEL) {
    case 'ALL':
    case 'HIGH':
    case 'LOW':
      return true
    default:
      return false
  }
}