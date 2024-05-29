import type { RecordOfredirect } from "$lib/models";
import { KVwrapper } from "$lib/server/kvdb";

export type AnswerStatType = {
  shortURL: string
  fullURL?: string
  records: RecordOfredirect[]
  message?: string
}

export async function load({ params, platform, depends }): Promise<AnswerStatType> {

  const result: AnswerStatType = {
    shortURL: '',
    records: []
  }

  if (!platform) {
    result.message = 'platform not found'
    return result
  }
  if (!params.shortUrl) {
    result.message = 'shortUrl is empty'
    return result
  }

  result.shortURL = params.shortUrl

  depends('app:stats')

  const kvDB = new KVwrapper(platform)
  const FOREVER = true

  let cursor: string | undefined = undefined
  const prefix = kvDB.hashKeyItemPrefix(params.shortUrl)
  const URLs = await kvDB.getURLs(params.shortUrl)

  if (!URLs) {
    result.message = 'not found'
    return result
  }

  result.fullURL = URLs.fullURL

  while (FOREVER) {
    const listPart = await kvDB.list(cursor ? { cursor } : { limit: 100, prefix })

    const readKeys = listPart.keys.map(item => item.name)

    await Promise.all(readKeys.map(async (item) => {
      let record:RecordOfredirect|string|null = (await kvDB.get(item)) as string | null
      if (record && typeof record === 'string') record = JSON.parse(record) as RecordOfredirect
      else {
        return false
      }

      if (record) result.records.push(record)

      return true
    }))
    await new Promise((resolve) => setTimeout(resolve, 100))    

    if (listPart.list_complete)  break;
    
    cursor = listPart.cursor
  }

  return result
}