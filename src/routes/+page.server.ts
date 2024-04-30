import type {Actions} from './$types'
import { errorMessageInvalidURL, validateURLs } from '$lib/validation';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	default: async ({ request }) => { // ({ cookies, request })
		const data = await request.formData()		

    const fullUrl = data.get('fullURL') as string
    const shortURL = data.get('shortURL') as string

    const errUrls = validateURLs(fullUrl, shortURL, 'invalids')
  
    // DEBUG 
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if(!errUrls.length) {
      // TODO db.createTodo(....)      
      return { success: true, message: `Short URL was linked:<br/>${shortURL}<br/>to<br/>${fullUrl}`}
    }

    return fail(422, { errUrls, error: errorMessageInvalidURL })
  }
}