export const sha1 = async (text: string): Promise<string> => {
  return crypto.subtle.digest('SHA-1', new TextEncoder().encode(text)).then((hash) =>
    Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  )
}

export const sha384 = async (text: string): Promise<string> => {
  return crypto.subtle.digest('SHA-384', new TextEncoder().encode(text)).then((hash) =>
    Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  )
}
