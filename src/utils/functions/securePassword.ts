import { SHA1, SHA384 } from 'crypto-js'

export default async (password: string) => {
  const firstHashing = SHA1(password)
  const secondHashing = SHA384(firstHashing.toString())
  const thirdHashing = SHA1(secondHashing.toString())

  return thirdHashing.toString()
}