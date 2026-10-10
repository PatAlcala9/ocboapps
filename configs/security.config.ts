type TokenType = {
  name: string
  encryption: 'rsa' | 'eddsa'
  expiration: number
}

type KeyType = {
  public_key: string
}

type CacheType = {
  encrypt: boolean
  key: string
  nonce: string
}

const security = {
  token: {
    name: 'ocboapps', // output: dasig-token
    encryption: 'rsa',
    expiration: 9, // seconds
  } satisfies TokenType,

  rsa: {
    public_key: import.meta.env.VITE_RSA_PUBLIC_KEY,
  } satisfies KeyType,

  eddsa: {
    public_key: import.meta.env.VITE_EDDSA_PUBLIC_KEY,
  } satisfies KeyType,

  cache: {
    encrypt: true,
    key: import.meta.env.VITE_SECRET_KEY,
    nonce: import.meta.env.VITE_NONCE,
  } satisfies CacheType,
}

export { security as default }
