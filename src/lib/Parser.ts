import { v4 as uuidv4 } from 'uuid'

export enum Action {
  read = 'read',
  write = 'write'
}

export type Request = {
  sender: string
  technology: 'SQL' | 'S3' | 'REST'
  query: string
}

export type ParsedRequest = {
  id: string
  sender: string
  action: Action
  resource: string
}

export class Parser {
  static parse (request: Request): ParsedRequest {
    const { technology } = request

    const r = {
      ...request,
      id: uuidv4()
    }

    switch (technology) {
      case 'SQL':
        return Parser.parseSQL(r)
      case 'S3':
        return Parser.parseS3(r)
      case 'REST':
        return Parser.parseREST(r)
      default:
        throw new Error('Unsupported technology')
    }
  }

  private static parseSQL (request: Request & { id: string }): ParsedRequest {
    const { id, sender, query } = request
    const [, sqlAction] = query.match(/^(SELECT|UPDATE|INSERT)/)!

    let action
    let resource
    switch (sqlAction) {
      case 'SELECT':
        const [, , sqlSelectResource] = query.match(
          /^SELECT\s+([\w_.]+|\*)\s+FROM\s+([\w_]+)/
        )!
        action = Action.read
        resource = sqlSelectResource
        break
      case 'UPDATE':
        const [, sqlUpdateResource] = query.match(/^UPDATE\s+([\w_.]+|\*)\s+/)!
        action = Action.write
        resource = sqlUpdateResource
        break
      case 'INSERT':
        const [, sqlInsertResource] = query.match(
          /^INSERT INTO\s+([\w_.]+|\*)\s+/
        )!
        action = Action.write
        resource = sqlInsertResource
        break
      default:
        throw new Error('Unsupported query')
    }

    return { id, sender, action, resource }
  }

  private static parseS3 (request: Request & { id: string }): ParsedRequest {
    throw new Error('Technology not supported')
  }

  private static parseREST (request: Request & { id: string }): ParsedRequest {
    throw new Error('Technology not supported')
  }
}
