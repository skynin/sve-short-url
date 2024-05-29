import type {Actions} from './$types'
import { errorMessageInvalidURL, validateURLs } from '$lib/validation';
import { fail } from '@sveltejs/kit';
import { KVwrapper } from '$lib/server/kvdb'

export const actions: Actions = {
	default: async ({ request, platform }) => { // ({ cookies, request })
		const data = await request.formData()		

    const fullURL = encodeURI(data.get('fullURL') as string)
    const shortURL = encodeURI(data.get('shortURL') as string)

    const errUrls = validateURLs(fullURL, shortURL, 'invalids')

    try {
      if(!errUrls.length && platform) {
        const kvDB = new KVwrapper(platform)
        const shortKey = await kvDB.putURL({shortURL, fullURL})

        await new Promise((resolve) => setTimeout(resolve, 100))

        const result = await kvDB.get(shortKey)

        return { success: true, message: `Short URL was linked:<br/>${shortURL}<br/>to<br/>${fullURL}<br/>hash: ${shortKey}<br/>saved: ${result?'yes':'NO'}` }
      }
    } catch (e) {
      console.log(e)
      return fail(500, { error: 'KV error: ' + e })
    }

    return fail(422, { errUrls, error: platform ? errorMessageInvalidURL : 'App.platform error' })
  }
}