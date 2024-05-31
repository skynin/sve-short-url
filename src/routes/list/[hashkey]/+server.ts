// import type {PageServerLoad} from'./$types'
import { json } from '@sveltejs/kit'
import { KVwrapper } from "$lib/server/kvdb";
import { sleep } from '$lib';

async function deleteByPrefix(kvDB: KVwrapper, prefix: string): Promise<void> {
  const allDeleted: {[key: string]: boolean} = {}

  const FOREVER = true
  let cursor: string | undefined = undefined

  while (FOREVER) {
    const listPart = await kvDB.list(cursor ? { cursor } : { limit: 100, prefix })

    const readKeys = listPart.keys.map(item => item.name)

    // paranoid check
    for (const item of readKeys) {
      if (allDeleted[item]) {
        throw 'kvDB.list return the same key twice: ' + item
      }
    }
    readKeys.forEach(item => allDeleted[item] = true)

    await Promise.all(readKeys.map(item => kvDB.delete(item)))
    await sleep(2000)

    if (listPart.list_complete)  break;

    cursor = listPart.cursor
  }
}

export async function DELETE({ params, platform }) { // request

  const { hashkey } = params

  if (!hashkey || !platform) {
    return json({ 
      success: false,
      message: 'hashkey or platform not found'
    })  
  }

  try {
    const kvDB = new KVwrapper(platform)
    await deleteByPrefix(kvDB, hashkey)    
  } catch (e) {
    console.log(e)
    return json({ 
      success: false,
      message: 'delete error: ' + e
     }) 
  }  

  return json({ 
    success: true,
    message: 'OK'
   })
}

