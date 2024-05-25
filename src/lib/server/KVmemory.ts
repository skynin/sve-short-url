export class KVmemory {
  private data: Map<string, string> = new Map()

  async get(
    key: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: Partial<KVNamespaceGetOptions<undefined>>,
  ): Promise<string | null> {
    return Promise.resolve(this.data.get(key) || null)
  }

  async put(
    key: string,
    value: string | ArrayBuffer | ArrayBufferView | ReadableStream,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: KVNamespacePutOptions,
  ): Promise<void> {
    this.data.set(key, value as string)
    return Promise.resolve()
  }

  async list<Metadata = unknown>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options?: KVNamespaceListOptions,
  ): Promise<KVNamespaceListResult<Metadata, string>> {

    const keys: KVNamespaceListKey<Metadata, string>[] = []
    for (const key of this.data.keys()) {
      keys.push({name:key})
  }

    return Promise.resolve({
      keys, list_complete: true, cacheStatus: null
    })
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key)
    return Promise.resolve()
  }
}