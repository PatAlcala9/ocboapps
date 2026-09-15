const security = {
  token: {
    name: "ocboapps",    // output: dasig-token
    encryption: "rsa",
    expiration: 9     // seconds
  },

  rsa: {
    public_key: import.meta.env.VITE_PUBLIC_KEY
  } 
}

export { security as default }
