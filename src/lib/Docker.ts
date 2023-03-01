import { LoggingPolicy } from './PDP'
import { Docker as DockerClient, Options } from 'docker-cli-js'

const options = new Options()
const docker = new DockerClient(options)

const LOCAL_ENV_HOST = process.env.LOCAL_ENV_HOST
const DOCKER_FOLDER = process.env.DOCKER_FOLDER
let port: number

export class Docker {
  static async build (
    requestId: string,
    technology: string,
    resource: string, // path of the file containing the SQL that inits the DB with the desired data
    loggingPolicy: string
  ) {
    let dockerPath = DOCKER_FOLDER + '/'
    switch (technology) {
      case 'SQL':
        dockerPath += 'sql'
        port = 5432
        break
      default:
        throw new Error('Unsupported technology')
    }

    const args = `REQUEST_ID=\${${requestId}}`

    const data = await docker.command(
      `build -t dam --build-arg ${args} ${dockerPath}`
    )
    console.log(data)
  }

  static async publish () {
    await docker.command(`publish dam`)
  }

  static async run () {
    await docker.command(`run -p ${port}:${port} dam`)
    return `${LOCAL_ENV_HOST}/:${port}`
  }
}
