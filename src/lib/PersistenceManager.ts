import { IPFS } from './IPFS'
import { SmartContract } from './SmartContract'
import { Decision } from './PDP'
import bs58 from 'bs58'

export class PersistenceManager {
  static async storeDecision (requestId: string, decision: Decision) {
    const decisionCid = await IPFS.put(decision)

    console.log('Decision stored on IPFS.')
    console.log('CID: ' + decisionCid)

    // CID v0 to 32 byte string
    const cidBytesString = Buffer.from(
      bs58.decode(decisionCid.toV0().toString()).slice(2)
    ).toString('hex')

    await SmartContract.storeDecision(requestId, cidBytesString)
  }

  static async storeLogs (requestId: string, logs: string) {
    const logsCid = await IPFS.put({ logs })
    await SmartContract.storeLog(requestId, 'logsCid')
  }
}
