import { ParsedRequest } from './Parser'

export class PDP {
  static async validate (request: ParsedRequest): Promise<Decision> {
    // TODO: implement
    throw Error('NotImplemented')
  }
}

export type Decision = {
  allow: boolean
}
