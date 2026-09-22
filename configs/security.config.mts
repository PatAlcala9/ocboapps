const security = {
  token: {
    name: "ocboapps",    // output: dasig-token
    encryption: "rsa",
    expiration: 9     // seconds
  },

  rsa: {
    public_key: import.meta.env.VITE_PUBLIC_KEY
  },

  cache: {
    encrypt: true,
    key: import.meta.env.VITE_SECRET_KEY,
    nonce: import.meta.env.VITE_NONCE
  }
}

export { security as default }
