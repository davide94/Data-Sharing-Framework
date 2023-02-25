import Web3 from 'web3'

const RPC_URL = process.env.RPC_URL!
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!
const WALLET_PUBLIC_KEY = process.env.WALLET_PUBLIC_KEY!
const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY!
const ABI = require('../../Contract/SC-ABI')
const MAX_GAS = 300000

const web3 = new Web3(RPC_URL)
const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS, {
  from: WALLET_PUBLIC_KEY
})

export class SmartContract {
  private static async signTransaction (data: string) {
    const transaction = {
      from: WALLET_PUBLIC_KEY,
      to: CONTRACT_ADDRESS,
      gas: MAX_GAS,
      data
    }
    return await web3.eth.accounts.signTransaction(
      transaction,
      WALLET_PRIVATE_KEY
    )
  }

  private static async sendTransaction (data: string) {
    const signedTransaction = await SmartContract.signTransaction(data)
    return web3.eth.sendSignedTransaction(signedTransaction.rawTransaction!)
  }

  static async storeDecision (requestId: string, cid: string) {
    const transactionData = contract.methods
      .storeDecision(requestId, cid)
      .encodeABI()
    return SmartContract.sendTransaction(transactionData)
  }

  static async storeLog (requestId: string, cid: string) {
    const transactionData = contract.methods
      .storeLog(requestId, cid)
      .encodeABI()
    return SmartContract.sendTransaction(transactionData)
  }

  static async getRequestInfo (id: string) {
    const { '0': requestId, '1': cid } = await contract.methods
      .getRequestInfo(id)
      .call()
    return { requestId, cid }
  }
}
