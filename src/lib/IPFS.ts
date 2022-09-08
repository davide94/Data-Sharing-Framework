import * as IPFSCore from 'ipfs-core'

export class IPFS {
  static instance: IPFSCore.IPFS

  private static async getInstance () {
    if (!IPFS.instance) {
      IPFS.instance = await IPFSCore.create()
    }
    return IPFS.instance
  }

  static async add (data: any): Promise<string> {
    const instance = await IPFS.getInstance()
    const fileAdded = await instance.add({
      content: data
    })

    return fileAdded.cid.toString()
  }
}
