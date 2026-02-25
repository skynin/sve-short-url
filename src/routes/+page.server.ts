import type {Actions} from './$types'
import { errorMessageInvalidURL, validateURLs } from '$lib/validation';
import { fail } from '@sveltejs/kit';
import { KVwrapper } from '$lib/server/kvdb'

export const actions: Actions = {
	default: async ({ request, platform }) => { // ({ cookies, request })
		const data = await request.formData()	
    
    const context = platform?.context

    const fullURL = encodeURI(data.get('fullURL') as string)
    const shortURL = encodeURI(data.get('shortURL') as string)

    const errUrls = validateURLs(fullURL, shortURL, 'invalids')

    try {
      if(!errUrls.length && platform) {
        const kvDB = new KVwrapper(platform)
        const outResult = {shortKey: ''}

        context?.waitUntil(kvDB.putURL({shortURL, fullURL}, outResult))

        const shortKey = outResult.shortKey

        return { success: true, message: `Short URL was linked:<br/>${shortURL}<br/>to<br/>${fullURL}<br/>hash: ${shortKey}` }
      }
    } catch (e) {
      console.log(e)
      return fail(500, { error: 'KV error: ' + e })
    }

    return fail(422, { errUrls, error: platform ? errorMessageInvalidURL : 'App.platform error' })
  }
}