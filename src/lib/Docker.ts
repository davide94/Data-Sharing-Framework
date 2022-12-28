import { LoggingPolicy } from './PDP'
import { Docker as DockerClient, Options } from 'docker-cli-js'

const options = new Options()
const docker = new DockerClient(options)

const LOCAL_ENV_HOST = process.env.LOCAL_ENV_HOST
let port: number

export class Docker {
  static async build (
    requestId: string,
    technology: string,
    resource: string, // path of the file containing the SQL that inits the DB with the desired data
    loggingPolicy: string
  ) {
    let dockerfile
    switch (technology) {
      case 'SQL':
        dockerfile = 'sql.docker-compose.yml'
        port = 5432
        break
      default:
        throw new Error('Unsupported technology')
    }

    const args = `REQUEST_ID=\${${requestId}} RESOURCE=\${${resource}} LOGGING_POLICY=\${${loggingPolicy}} `

    const data = await docker.command(
      `build -f ${dockerfile} -t DAM --build-arg ${args}`
    )
    console.log(data)
  }

  static async publish () {
    await docker.command(`publish DAM`)
  }

  static async run () {
    await docker.command('run DAM')
    return `${LOCAL_ENV_HOST}/:${port}`
  }
}
