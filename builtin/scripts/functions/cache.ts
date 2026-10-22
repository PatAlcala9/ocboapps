import site from 'configs/site.config.json'
import security from 'configs/security.config.json'
import { xchacha20poly1305 } from '@noble/ciphers/chacha.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const KEY = import.meta.env.VITE_SECRET_KEY
const NONCE = import.meta.env.VITE_NONCE

const bytesToHex = (bytes: Uint8Array<ArrayBuffer>) => {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const hexToBytes = (hex: string) => {
  if (typeof hex !== 'string') {
    throw new TypeError('Hex must be a string')
  }

  if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2 !== 0) {
    throw new Error('Invalid hex string')
  }

  const bytes = new Uint8Array(hex.length / 2)

  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }

  return bytes
}

const encryptXCP = (text: string) => {
  const keyBytes = encoder.encode(KEY)
  const nonceBytes = encoder.encode(NONCE)

  const chacha = xchacha20poly1305(keyBytes, nonceBytes)
  const data = encoder.encode(text)
  const ciphertext = chacha.encrypt(data)

  return ciphertext
}

const decryptXCP = (encrypted: string) => {
  const keyBytes = encoder.encode(KEY)
  const nonceBytes = encoder.encode(NONCE)

  const itemBytes = hexToBytes(encrypted)
  const chacha = xchacha20poly1305(keyBytes, nonceBytes)
  const decrypted = chacha.decrypt(itemBytes)
  const decryptedString = decoder.decode(decrypted)

  return decryptedString
}

class CacheInstance {
  private _name: string

  constructor(name: string) {
    this._name = name
  }

  set(value: string): CacheInstance {
    if (site.cache.enabled) {
      if (security.cache.encrypt) {
        const cipherValue = encryptXCP(value)
        const cipherValueHex = bytesToHex(cipherValue)
        const cipherName = encryptXCP(this._name)
        const cipherNameHex = bytesToHex(cipherName).toString()
        const newName = `_${cipherNameHex}`

        sessionStorage.setItem(newName, cipherValueHex)
      } else {
        sessionStorage.setItem(this._name, value)
      }
    }
    return this
  }

  get(): string | null {
    if (site.cache.enabled) {
      if (security.cache.encrypt) {
        let item
        const cipherName = encryptXCP(this._name)
        const cipherNameHex = bytesToHex(cipherName).toString()
        const newName = `_${cipherNameHex}`

        try {
          if (sessionStorage.getItem(newName) !== null) {
            item = sessionStorage.getItem(newName)!
            const result = decryptXCP(item)
            return result
          } else return null
        } catch {
          return null
        }
      } else {
        const item = sessionStorage.getItem(this._name)!
        return item
      }
    }
    return null
  }

  delete() {
    const cipherName = encryptXCP(this._name)
    const cipherNameHex = bytesToHex(cipherName).toString()
    const newName = `_${cipherNameHex}`

    sessionStorage.removeItem(newName)
  }
}

export const cache = (name: string): CacheInstance => {
  return new CacheInstance(name)
}
