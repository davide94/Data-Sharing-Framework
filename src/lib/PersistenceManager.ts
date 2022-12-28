import { IPFS } from './IPFS'
import { SmartContract } from './SmartContract'
import { Decision } from './PDP'

export class PersistenceManager {
  static async storeDecision (requestId: string, decision: Decision) {
    const decisionCid = await IPFS.add(decision)
    await SmartContract.storeDecision(requestId, decisionCid)
  }

  static async storeLogs (requestId: string, logs: string) {
    const logsCid = await IPFS.add(logs)
    await SmartContract.storeLog(requestId, logsCid)
  }
}
