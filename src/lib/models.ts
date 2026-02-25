/*
сохранять в kv время перехода
сохранять в kv useragent браузера, который совершал переход
сохранять в kv geoip данные которые предоставляет нам cloudflare
сохранять в kv ip адрес с которого был осуществлен переход
*/

export type RecordOfredirect = {
  time: number
  userAgent: string
  geoIP: string
  sourceIP: string
  host: string
}

export type RecordURLmatch = {
  shortURL: string,
  fullURL: string,
  hashKey?: string
}

// Key metadata	1024 bytes	1024 bytes
export type MetaShortURL = {
  totals: number
}
