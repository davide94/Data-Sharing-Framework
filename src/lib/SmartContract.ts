import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'

const URL = process.env.RPC_URL!
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!

const ABI = { type: 'function' }

export class SmartContract {
  private static instance: Contract

  private static getInstance () {
    if (!SmartContract.instance) {
      const web3 = new Web3(URL)
      // @ts-ignore
      SmartContract.instance = new web3.eth.Contract(ABI, CONTRACT_ADDRESS)
    }
    return SmartContract.instance
  }

  static async storeDecision (requestId: string, cid: string) {
    const rid = requestId.replace(/-/g, '')

    const instance = await SmartContract.getInstance()
    return await instance.methods.storeDecision(rid, cid).call()
  }

  static async storeLog (requestId: string, cid: string) {
    const instance = await SmartContract.getInstance()
    return await instance.methods.storeLog(requestId, cid).call()
  }

  static async getRequestInfo (requestId: string) {
    const instance = await SmartContract.getInstance()
    return await instance.methods.getRequestInfo(requestId).call()
  }
}
