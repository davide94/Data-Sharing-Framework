import { ParsedRequest } from './Parser'

export class PDP {
  static async validate (request: ParsedRequest): Promise<Decision> {
    // TODO: implement
    throw 'NotImplemented'
  }
}

export type Decision = {
  allow: boolean
}
