import { KVwrapper } from "$lib/server/kvdb";
import { json, redirect } from "@sveltejs/kit";

const searchIn = ['cf-connecting-ip','x-real-ip','x-forwarded-for','x-forwarded-proto']

export async function GET({ params, platform, request, getClientAddress }) {
  if (!platform) return json({ success: false, message: 'platform not found' })
  const kvDB = new KVwrapper(platform)

  const result = await kvDB.getURLs(params.shortUrl)
  if (!result) {
    return json({ success: false, message: 'not found' })
  }

  const context = platform?.context

  /*
    сохранять в kv время перехода
    сохранять в kv useragent браузера, который совершал переход
    сохранять в kv geoip данные которые предоставляет нам cloudflare
    сохранять в kv ip адрес с которого был осуществлен переход
  */
  const time = Date.now()
  const userAgent = request.headers.get('user-agent') as string  
  let sourceIP: string = ''
  searchIn.find(item => sourceIP=request.headers.get(item)) || (sourceIP=getClientAddress())
  const host = request.headers.get('host') || 'unknown'
  const geoIP = request.headers.get('cf-ipcountry') || 'unknown'

  context.waitUntil(kvDB.putURLredirect(params.shortUrl, {time, userAgent, sourceIP, geoIP, host}))
  
  const prefix = result.fullURL.includes('://') ? '' : '/sho/'

  throw redirect(307, prefix + result.fullURL);
}

/*
keysaccept,
accept-encoding,
accept-language,
cf-connecting-ip,
cf-ipcountry,
cf-ray,
cf-visitor,
connection,
dnt,
host,
priority,
sec-fetch-dest,
sec-fetch-mode,
sec-fetch-site,
sec-fetch-user,
upgrade-insecure-requests,
user-agent,
x-forwarded-proto,
x-real-ip
*/