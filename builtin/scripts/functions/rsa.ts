import security from 'configs/security.config'

const PUBLIC_KEY = security.rsa.public_key

const pemToArrayBuffer = (pem: string): ArrayBuffer => {
  const base64 = pem
    .replace(/-----BEGIN PUBLIC KEY-----/g, '')
    .replace(/-----END PUBLIC KEY-----/g, '')
    .replace(/\s/g, '')

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes.buffer
}

export const encrypt = async (text: string): Promise<string> => {
  const key = await window.crypto.subtle.importKey(
    'spki',
    pemToArrayBuffer(PUBLIC_KEY),
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    false,
    ['encrypt']
  )

  const encrypted = await window.crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP',
    },
    key,
    new TextEncoder().encode(text)
  )

  const bytes = new Uint8Array(encrypted)
  const array = btoa(String.fromCharCode(...bytes))
  const arrayFixed = array.replace(/\//g, '~')

  return arrayFixed
}
