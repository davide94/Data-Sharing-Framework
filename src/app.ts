import { v4 as uuidv4 } from 'uuid'
import express from 'express'
import 'dotenv/config'
import { Parser } from './lib/Parser'
import { PDP } from './lib/PDP'
import { Blockchain } from './lib/Blockchain'
import { Docker } from './lib/Docker'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// TODO: validate request

// TODO: use an actual DB
const db: { [id: string]: any } = {}

app.post('/', async (req, res) => {
  const request = Parser.parse(req.body)

  const decision = await PDP.validate(request)
  await Blockchain.store(decision)

  let statusCode, body
  if (decision.allow) {
    const id = uuidv4()
    const status = 'RECEIVED'
    db[id] = { status, request }

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
  const { status, endpoint } = task

  if (task.status === 'COMPLETED') {
    res.send({ status, endpoint })
  } else {
    res.status(202).send({ status })
  }
})

app.listen(process.env.PORT)

// TODO: make it run asynchronously
const worker = async () => {
  const [task] = Object.values(db).filter(x => x.status === 'RECEIVED')
  db[task.id].status = 'PROCESSING'

  // TODO: properly format docker file

  const image = await Docker.build()
  const imageURI = await Docker.publish(image)

  // TODO: deploy image in proper location
  // TODO: db[task.id].endpoint = ...

  db[task.id].status = 'COMPLETED'
}
