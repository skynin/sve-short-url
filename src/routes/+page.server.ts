import type {Actions} from './$types'
import { errorMessageInvalidURL, validateURLs } from '$lib/validation';
import { fail } from '@sveltejs/kit';
import { KVwrapper } from '$lib/server/kvdb'

export const actions: Actions = {
	default: async ({ request, platform }) => { // ({ cookies, request })
		const data = await request.formData()		

    const fullURL = data.get('fullURL') as string
    const shortURL = data.get('shortURL') as string

    const errUrls = validateURLs(fullURL, shortURL, 'invalids')

    // DEBUG 
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      if(!errUrls.length && platform) {
        const kvDB = new KVwrapper(platform)
        await kvDB.put(kvDB.hashkey(shortURL), JSON.stringify({shortURL, fullURL})) 
        return { success: true, message: `Short URL was linked:<br/>${shortURL}<br/>to<br/>${fullURL}`}
      }
    } catch (e) {
      console.log(e)
      return fail(500, { error: 'KV error: ' + e })
    }

    return fail(422, { errUrls, error: platform ? errorMessageInvalidURL : 'App.platform error' })
  }
}