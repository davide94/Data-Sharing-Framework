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

  private static hexToCid (hex: string): string {
    return 'Qm' + bs58.encode(Buffer.from(hex.slice(2), 'hex'))
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

    return transaction
  }

  static async storeLog (requestId: string, log: string) {
    const rid = PersistenceManager.ridHex(requestId)

    const ridHex = PersistenceManager.ridHex(requestId)
    const { logsCid: cidHex } = await SmartContract.getRequestInfo(ridHex)
    const links: any[] = []

    // if (Number(cidHex) != 0) {
    //   links.push(PersistenceManager.hexToCid(cidHex))
    // }

    const logsCid = await IPFS.put(log, links)
    console.log('Logs stored on IPFS.')
    console.log('CID: ' + logsCid)

    const cid = PersistenceManager.cidHex(logsCid)
    console.log(cid)

    const transaction = await SmartContract.storeLog(rid, cid)
    console.log('Decision stored on Blockchain.')
    console.log('transaction:')
    console.log(transaction)

    return transaction
  }
}
