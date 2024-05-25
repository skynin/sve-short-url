import { KVwrapper } from "$lib/server/kvdb";

type RecordOfURL = {
  shortURL?: string
  fullURL?: string
  hashURL: string
}

async function readAllInfo(kvDB: KVwrapper, hashKey: string) : Promise<RecordOfURL> {

  const pairURLs = await kvDB.get(hashKey)
  const result: RecordOfURL = {
    hashURL: hashKey
  }

  try {
    if (pairURLs) {
      const parsed = JSON.parse(pairURLs)
      result.shortURL = parsed.shortURL
      result.fullURL = parsed.fullURL
    }
  } catch (e) {
    console.log(e)
  }

  return result
}

type AnswerType = {
  success: boolean, message: string, list: RecordOfURL[]
}

export async function load({ platform, depends }): Promise<AnswerType> {

  if (!platform) return {
    success: false,
    message: 'platform not found',
    list: []
  }

  depends('app:list');

  try {
    const kvDB = new KVwrapper(platform)
    const listKeys = await kvDB.list({limit: 100})

    const result: AnswerType = {
      success: true,
      message: 'OK',      
      list: []
    }

    await Promise.all(listKeys.keys.map(async item => {
      return readAllInfo(kvDB, item.name).then(rec => result.list.push(rec))
    }))

    return result
  } catch (eX) {
    return {
      success: false,
      message: '' + eX,
      list: []
    }
  }
}

