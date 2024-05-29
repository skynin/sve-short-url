import { getRandomInt } from '$lib'
import type { RecordOfredirect, RecordURLmatch } from '$lib/models'
import { KVmemory } from './KVmemory'

const kvMem = new KVmemory()

/* string-hash
( https://github.com/darkskyapp/string-hash )
https://moro.neocities.org/javascript-hash-functions */
function hashString (origStr: string, radix: number = 36) : string {

  if (!origStr) return '42'

  let hash: number = 5381,
      i: number    = origStr.length
  const firstSym: string = (origStr.length ? origStr.charCodeAt(0) : 42).toString(radix)
  
  while(i>1) // we already included first symbol
    hash = (hash * 33) ^ origStr.charCodeAt(--i)

  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
   * integers. Since we want the results to be always positive, convert the
   * signed int to an unsigned by doing an unsigned bitshift. */
  return firstSym + (hash >>> 0).toString(radix) + origStr.length.toString(radix).slice(-4);
}

export const KEY_ITEM_DELIMITER = ':'

const MAX_HASH_LENGTH = 1000

export class KVwrapper {

  private platform: Readonly<App.Platform>
  constructor(platform : Readonly<App.Platform>) {
    this.platform = platform
  }

  private cacheHash = new Map<string, string>()

  hashKey(origKey: string) : string {
    if (this.cacheHash.size > MAX_HASH_LENGTH) this.cacheHash.clear()

    if (this.cacheHash.has(origKey)) return this.cacheHash.get(origKey) as string

    const result = hashString(origKey)
    this.cacheHash.set(origKey, result)

    return result
  }

  hashKeyItemPrefix(origKey: string) : string {
    return this.hashKey(origKey) + KEY_ITEM_DELIMITER
  }

  get KV() : KVNamespace | KVmemory | undefined {
    return this.platform.env?.SVE_SHORT_URL || kvMem
  }

  async get(key: string, options?: Partial<KVNamespaceGetOptions<undefined>>): Promise<string | null> {
    return this.KV?.get(key, options) || null
  }

  async getURLs(shortURL: string, byHash = false): Promise<RecordURLmatch | null> {
    const hashKey = byHash ? shortURL : this.hashKey(shortURL)
    const match = await this.get(hashKey)
    if (match) return Object.assign({hashKey},JSON.parse(match))
    return null
  }

  async put(key: string, value: string | ArrayBuffer | ArrayBufferView | ReadableStream, options?: KVNamespacePutOptions): Promise<void> {
    this.KV!.put(key, value, options)
  }

  async putURL(match: RecordURLmatch): Promise<string> {
    const shortKey = this.hashKey(match.shortURL)
    return this.put(shortKey, JSON.stringify(match)).then(() => shortKey)
  }

  async putURLredirect(shortURL: string, record: RecordOfredirect): Promise<string> {
    const shortKey = this.hashKeyItemPrefix(shortURL) + record.time.toString(36) + hashString(record.sourceIP+record.userAgent) + getRandomInt(0, 99999).toString(36)
    return this.put(shortKey, JSON.stringify(record)).then(() => shortKey)
  }

  async list(options?: KVNamespaceListOptions | undefined) : Promise<KVNamespaceListResult<unknown, string>>{
    return this.KV!.list(options)
  }

  async delete(key: string) {
    this.KV!.delete(key)
  }
}
