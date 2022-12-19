import { v4 as uuidv4 } from 'uuid'
import express from 'express'
import 'dotenv/config'
import { Parser } from './lib/Parser'
import { PDP } from './lib/PDP'
import { Docker } from './lib/Docker'
import { PersistenceManager } from './lib/PersistenceManager'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db: { [id: string]: any } = {}

app.post('/', async (req, res) => {
  const request = Parser.parse(req.body)

  const decision = await PDP.validate(request)
  await PersistenceManager.storeDecision(decision)

  let statusCode, body
  if (decision.allow) {
    const id = uuidv4()
    const status = 'RECEIVED'
    db[id] = { status, request, decision }

    statusCode = 202
    body = { id, status }
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

app.listen(process.env.PORT)

const worker = async () => {
  const [task] = Object.values(db).filter(x => x.status === 'RECEIVED')
  db[task.id].status = 'PROCESSING'

  await Docker.build(
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

setInterval(worker, 60 * 1000)
