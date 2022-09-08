import { LoggingPolicy } from './PDP'

export class Docker {
  static async build (
    technology: string,
    resource: string,
    loggingPolicy: LoggingPolicy
  ) {
    throw Error('NotImplemented')

    // TODO: get Dockerfile template based on technology

    // TODO: cp resource

    // TODO: store loggingPolicy
  }

  static async publish (image: any) {
    // TODO: implement
    throw Error('NotImplemented')
  }

  static async run (image: any) {
    // TODO: implement
    throw Error('NotImplemented')
  }
}
