import {createHash} from "node:crypto"

const MD5 = createHash("md5")

export class KVwrapper {
  private platform: Readonly<App.Platform>
  constructor(platform : Readonly<App.Platform>) {
    this.platform = platform
  }

  hashkey(origKey: string) : string {
    const hashKey = MD5.copy().update(origKey).digest("hex")
    return hashKey + origKey.replaceAll(/[^A-Fa-f0-9]/g,'').toLowerCase() + (""+origKey.length).slice(-1)
  }

  async get(key: string, options?: Partial<KVNamespaceGetOptions<undefined>>,
  ): Promise<string | null> {
    return this.platform.SVE_SHORT_URL.get(key, options)
  }

  async put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: KVNamespacePutOptions): Promise<void> {
    this.platform.SVE_SHORT_URL.put(key, value, options)
  }

  async list(options?: KVNamespaceListOptions | undefined) : Promise<KVNamespaceListResult<unknown, string>>{
    return this.platform.SVE_SHORT_URL.list(options)
  }

  async delete(key: string) {
    this.platform.SVE_SHORT_URL.delete(key)
  }
}
