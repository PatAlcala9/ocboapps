// oxlint-disable no-unused-vars

type TokenType = {
  name: string
  encryption: 'rsa' | 'eddsa'
  expiration: number
}

type CacheSecurityType = {
  encrypt: boolean
}
