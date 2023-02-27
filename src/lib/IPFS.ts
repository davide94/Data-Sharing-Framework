import { CID, create, IPFSHTTPClient } from 'ipfs-http-client'
const Cid = require('cids')

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
    return client.dag.get(cid)
  }

  static async put (data: string, links: string[] = []): Promise<CID> {
    const instance = await IPFS.getInstance()

    return await instance.dag.put(
      {
        Data: Buffer.from(data),
        Links: links.map(x => ({ Hash: new Cid(x) }))
      },
      {
        storeCodec: 'dag-pb'
      }
    )
  }
}
