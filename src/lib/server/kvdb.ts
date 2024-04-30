class DBkv {

  fakeDB = new Map<string, string>()

  async getFull(shortURL: string): Promise<string | null> {
    return this.fakeDB.get(shortURL) || null
  }

  async setShortUrl(fullUrl: string, shortUrl: string): Promise<void> {
    this.fakeDB.set(shortUrl, fullUrl)    
  }

}

export const kvDB = new DBkv()
