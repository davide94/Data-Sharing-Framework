import { CID, create, IPFSHTTPClient } from 'ipfs-http-client'

const IPFS_URI = process.env.IPFS_URI

export class IPFS {
  static instance: IPFSHTTPClient

  private static async getInstance () {
    if (!IPFS.instance) {
      IPFS.instance = await create({ url: IPFS_URI + '/api/v0' })
    }
    return IPFS.instance
  }

  static async get (cid: CID): Promise<any> {
    const client = await IPFS.getInstance()
    const iterator = client.dag.get(cid)

    return iterator
  }

  static async put (data: object): Promise<CID> {
    const instance = await IPFS.getInstance()
    const cid = await instance.dag.put(
      {
        Data: Buffer.from(JSON.stringify(data)),
        Links: []
      },
      {
        storeCodec: 'dag-pb'
      }
    )

    return cid
  }
}
