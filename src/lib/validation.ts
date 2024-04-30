// place files you want to import through the `$lib` alias in this folder.
export const isValidUrl = (urlString: string) => {
  try { 
    return Boolean(new URL(urlString)); 
  }
  catch(e) { 
    return false; 
  }
}

export type UrlNames = 'fullURL'|'shortURL'

export type ErrUrls = {url: string, isValid: boolean, urlName: UrlNames}

export const validateURLs = (fullURL: string, shortURL: string, opts: 'full' | 'invalids' = 'full') => {
  const arrChecks: ErrUrls[] = [
    {url: fullURL, isValid: isValidUrl(fullURL), urlName: 'fullURL'},
    {url: shortURL, isValid: isValidUrl(shortURL), urlName: 'shortURL'}
  ]

  return opts ==='full' ? arrChecks : arrChecks.filter((item) => !item.isValid)
}

export const errorMessageInvalidURL = 'Invalid URL'