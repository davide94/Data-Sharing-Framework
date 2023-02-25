import { IPFS } from './IPFS'
import { SmartContract } from './SmartContract'
import { Decision } from './PDP'
import bs58 from 'bs58'
import { CID } from 'ipfs-http-client'

export class PersistenceManager {
  private static ridHex (rid: string): string {
    return '0x' + rid.replace(/-/g, '')
  }

  private static cidHex (cid: CID): string {
    return (
      '0x' +
      Buffer.from(bs58.decode(cid.toV0().toString()).slice(2)).toString('hex')
    )
  }

  static async storeDecision (requestId: string, decision: Decision) {
    const rid = PersistenceManager.ridHex(requestId)

    const decisionCid = await IPFS.put(JSON.stringify(decision))

    console.log('Decision stored on IPFS.')
    console.log('CID: ' + decisionCid)

    const cid = PersistenceManager.cidHex(decisionCid)

    const transaction = await SmartContract.storeDecision(rid, cid)
    console.log('Decision stored on Blockchain.')
    console.log('transaction:')
    console.log(transaction)
  }

  static async storeLog (requestId: string, log: string) {
    const { cid: oldCid } = await SmartContract.getRequestInfo(requestId)
    const links: any[] = []
    if (Number(oldCid) != 0) {
      links.push(oldCid)
    }

    const logsCid = await IPFS.put(log, links)
    const cid = PersistenceManager.cidHex(logsCid)

    await SmartContract.storeLog(requestId, cid)
  }
}
