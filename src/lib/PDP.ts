import { ParsedRequest } from './Parser'

const PDP_URI = process.env.PDP_URI

export class PDP {
  static async validate (request: ParsedRequest): Promise<Decision> {
    const response = await fetch(`${PDP_URI}/validate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      throw Error('PDP Error')
    }
    const { allow, obligations } = await response.json()

    return {
      allow,
      deployLocal: !!obligations.find(
        (o: any) => o.obligationId === 'deployLocal'
      ),
      loggingPolicy: obligations.find(
        (o: any) => o.obligationId === 'loggingPolicy'
      )
    }
  }
}

export type Decision = {
  allow: boolean
  deployLocal: boolean
  loggingPolicy: LoggingPolicy
}

export type LoggingPolicy = 'ALL' | 'HIGH' | 'LOW'
