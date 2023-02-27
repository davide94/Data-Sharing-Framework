import { ParsedRequest } from './Parser'

const PDP_URI = process.env.PDP_URI

export class PDP {
  static async validate (request: ParsedRequest): Promise<Decision> {
    const { resource, sender, action } = request

    const xacmlRequest = `<Request xmlns="urn:oasis:names:tc:xacml:3.0:core:schema:wd-17" CombinedDecision="false" ReturnPolicyIdList="false">
        <Attributes Category="urn:oasis:names:tc:xacml:3.0:attribute-category:action">
            <Attribute AttributeId="urn:oasis:names:tc:xacml:1.0:action:action-id" IncludeInResult="false">
                <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">${action}</AttributeValue>
            </Attribute>
        </Attributes>
        <Attributes Category="urn:oasis:names:tc:xacml:1.0:subject-category:access-subject">
            <Attribute AttributeId="urn:oasis:names:tc:xacml:1.0:subject:subject-id" IncludeInResult="false">
                <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">${sender}</AttributeValue>
            </Attribute>
        </Attributes>
        <Attributes Category="urn:oasis:names:tc:xacml:3.0:attribute-category:resource">
            <Attribute AttributeId="urn:oasis:names:tc:xacml:1.0:resource:resource-id" IncludeInResult="false">
                <AttributeValue DataType="http://www.w3.org/2001/XMLSchema#string">${resource}</AttributeValue>
            </Attribute>
        </Attributes>
    </Request>`

    console.log('Evaluating XACML request:')
    console.log(xacmlRequest)

    const response = await fetch(`${PDP_URI}/validate`, {
      method: 'POST',
      body: xacmlRequest
    })

    if (!response.ok) {
      throw Error('PDP Error')
    }

    const xacmlResponse = await response.text()

    console.log('\nXACML response:')
    console.log(xacmlResponse)

    const [, decision] = /<Decision>([a-zA-Z]+)</gm.exec(xacmlResponse)!
    const allow = decision === 'Permit'

    let deployLocal, loggingPolicy

    if (allow) {
      const [, , x] = /logging-policy-id" ?(DataType=".+")?>(.+)</gm.exec(
        xacmlResponse
      )!
      const [, , xx] = /data-locality-id" ?(DataType=".+")?>(.+)</gm.exec(
        xacmlResponse
      )!

      loggingPolicy = x
      deployLocal = xx == 'local'
    }

    return {
      request,
      allow,
      deployLocal,
      loggingPolicy
    }
  }
}

export type Decision = {
  request: ParsedRequest
  allow: boolean
  deployLocal?: boolean
  loggingPolicy?: string
}

export type LoggingPolicy = 'ALL' | 'HIGH' | 'LOW'
