/*import {createHash} from "node:crypto"

const MD5 = createHash("md5")

function getHash(str: string) : string {
  return MD5.copy().update(str).digest("hex")
}*/

// https://moro.neocities.org/javascript-hash-functions
function hashFnv32a(str: string, asString: boolean, seed?: number) : number | string {
  /*jshint bitwise:false */
  let i:number = 0, l:number = 0;
  let hval:number = (seed === undefined) ? 0x811c9dc5 : seed;

  for (i = 0, l = str.length; i < l; i++) {
      hval ^= str.charCodeAt(i);
      hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
  }
  if( asString ){
      // Convert to 8 digit hex string
      return ("0000000" + (hval >>> 0).toString(16)).slice(-8);
  }
  return hval >>> 0;
}

function getHash(str: string) : string {
  return hashFnv32a(str, true) as string
}

export class KVwrapper {
  private platform: Readonly<App.Platform>
  constructor(platform : Readonly<App.Platform>) {
    this.platform = platform
  }

  hashkey(origKey: string) : string {
    const hashKey = getHash(origKey)
    return hashKey + origKey.replaceAll(/[^A-Fa-f0-9]/g,'').toLowerCase() + (""+origKey.length).slice(-3)
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
