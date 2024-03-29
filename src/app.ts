import { v4 as uuidv4 } from 'uuid'
import express from 'express'
import 'dotenv/config'
import { Parser } from './lib/Parser'
import { PDP } from './lib/PDP'
import { Docker } from './lib/Docker'
import { PersistenceManager } from './lib/PersistenceManager'

const PORT = process.env.PORT
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db: { [id: string]: any } = {}

app.post('/', async (req, res) => {
  const request = Parser.parse(req.body)
  request.id = uuidv4()

  console.log('Processing request:')
  console.log(request)

  const decision = await PDP.validate(request)

  console.log('Decision taken:')
  console.log(decision)

  await PersistenceManager.storeDecision(request.id, decision)

  let statusCode, body
  if (decision.allow) {
    const status = 'RECEIVED'
    db[decision.request.id] = { status, request, decision }

    statusCode = 202
    body = { id: decision.request.id, status, decision }
  } else {
    statusCode = 403
  }

  res.status(statusCode).send(body)
})

app.get('/status/:id', async (req, res) => {
  // @ts-ignore
  const task = db[req.id]
  const { status, endpoint, imageURI } = task

  if (task.status === 'COMPLETED') {
    if (task.decision.deployLocal) {
      res.send({ status, endpoint })
    } else {
      res.send({ status, imageURI })
    }
  } else {
    res.status(202).send({ status })
  }
})

app.listen(PORT, () => {
  console.log(`XAC listening on port ${PORT}`)
})

const worker = async (): Promise<any> => {
  const [task] = Object.values(db).filter(x => x.status === 'RECEIVED')

  if (task == null) {
    return setInterval(worker, 6 * 1000)
  }

  db[task.id].status = 'PROCESSING'

  await Docker.build(
    task.id,
    task.request.technology,
    task.request.resource,
    task.decision.loggingPolicy
  )

  if (task.decision.deployLocal) {
    db[task.id].endpoint = await Docker.run()
  } else {
    db[task.id].imageURI = await Docker.publish()
  }

  db[task.id].status = 'COMPLETED'
}

setInterval(worker, 6 * 1000)
