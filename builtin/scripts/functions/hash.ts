import { keccak_512 } from '@noble/hashes/sha3.js'
import { bytesToHex } from '@noble/hashes/utils.js'

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

export const sha3 = async (text: string): Promise<string> => {
  const data = new TextEncoder().encode(text)
  return bytesToHex(keccak_512(data))
}
