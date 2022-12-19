enum Action {
  read,
  write
}

export type Request = {
  sender: string
  technology: 'SQL' | 'S3' | 'REST'
  query: string
}

export type ParsedRequest = {
  sender: string
  action: Action
  resource: string
}

export class Parser {
  static parse (request: Request): ParsedRequest {
    const { sender, technology, query } = request

    switch (technology) {
      case 'SQL':
        return Parser.parseSQL(query, sender)
      case 'S3':
        return Parser.parseS3(query, sender)
      case 'REST':
        return Parser.parseREST(query, sender)
      default:
        throw new Error('Unsupported technology')
    }
  }

  private static parseSQL (query: string, sender: string): ParsedRequest {
    const [, sqlAction] = query.match(/^(SELECT|UPDATE|INSERT)[\s\S]+?\;\s*?$/)!

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

    return { sender, action, resource }
  }

  private static parseS3 (query: string, sender: string): ParsedRequest {
    throw new Error('Technology not supported')
  }

  private static parseREST (query: string, sender: string): ParsedRequest {
    throw new Error('Technology not supported')
  }
}
