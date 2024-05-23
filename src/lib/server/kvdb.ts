/* string-hash
( https://github.com/darkskyapp/string-hash )
https://moro.neocities.org/javascript-hash-functions+ */
function hashString (origStr: string, radix: number = 36) : string {

  if (!origStr) return '42'

  let hash: number = 5381,
      i: number    = origStr.length
  const firstSym: string = (origStr.length ? origStr.charCodeAt(0) : 42).toString(radix),
    secondSym: string = (origStr.length > 1 ? origStr.charCodeAt(1) : 42).toString(radix)
  
  while(i>2) // we already included first and second symbols
    hash = (hash * 33) ^ origStr.charCodeAt(--i)

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return firstSym + secondSym + (hash >>> 0).toString(radix) + origStr.length.toString(radix).slice(-4);
}

export class KVwrapper {
  private platform: Readonly<App.Platform>
  constructor(platform : Readonly<App.Platform>) {
    this.platform = platform
  }

  hashkey(origKey: string) : string {
    return hashString(origKey)
  }

  get KV() : KVNamespace | undefined {
    return this.platform.env?.SVE_SHORT_URL
  }

  async get(key: string, options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<string | null> {
    return this.KV?.get(key, options) || null
  }

  async put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: KVNamespacePutOptions): Promise<void> {
    this.KV!.put(key, value, options)
  }

  async list(options?: KVNamespaceListOptions | undefined) : Promise<KVNamespaceListResult<unknown, string>>{
    return this.KV!.list(options)
  }

  async delete(key: string) {
    this.KV!.delete(key)
  }
}
