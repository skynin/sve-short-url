// import type {PageServerLoad} from'./$types'
import { json } from '@sveltejs/kit'
import { KVwrapper } from "$lib/server/kvdb";

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
    await kvDB.delete(hashkey)
  } catch (e) {
    console.log(e)
    return json({ 
      success: false,
      message: 'delete error: ' + e
     }) 
  }  

  return json({ 
    success: true,
    message: 'OK ' + Object.keys(platform.env || {}).join(', ')
   })
}

