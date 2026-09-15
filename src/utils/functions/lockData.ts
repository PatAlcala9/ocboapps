import XChaCha20 from '@rabbit-company/xchacha20'

export default async (text: string) => {
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY
  try {
    const enc = XChaCha20.encrypt(text, SECRET_KEY)
    return enc
  } catch {
    return ''
  }
}
