/* string-hash
( https://github.com/darkskyapp/string-hash )
https://moro.neocities.org/javascript-hash-functions+ */
function hashString (origStr: string) : string {

  if (!origStr) return '42'

  let hash: number = 5381,
      i: number    = origStr.length
  const firstSym: string = (origStr.length ? origStr.charCodeAt(0) : 42).toString(16),
    secondSym: string = (origStr.length > 1 ? origStr.charCodeAt(1) : 42).toString(16)
  
  while(i>2) // we already included first and second symbols
    hash = (hash * 33) ^ origStr.charCodeAt(--i)

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return firstSym + secondSym + (hash >>> 0).toString(16) + origStr.length.toString(16).slice(-4);
}

export class KVwrapper {
  private platform: Readonly<App.Platform>
  constructor(platform : Readonly<App.Platform>) {
    this.platform = platform
  }

  hashkey(origKey: string) : string {
    return hashString(origKey)
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
