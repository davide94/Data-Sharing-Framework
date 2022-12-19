import { IPFS } from './IPFS'
import { SmartContract } from './SmartContract'
import { Decision } from './PDP'

export class PersistenceManager {
  static async storeDecision (decision: Decision) {
    const decisionCid = await IPFS.add(decision)
    await SmartContract.storeDecision(decisionCid)
  }

  static async storeLogs (logs: string) {
    const logsCid = await IPFS.add(logs)
    await SmartContract.storeLog(logsCid)
  }
}
