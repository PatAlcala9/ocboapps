import { sha1, sha384 } from '@dasig/hash'

export default async (password: string) => {
  const firstHashing = await sha1(password)
  const secondHashing = await sha384(firstHashing.toString())
  const thirdHashing = await sha1(secondHashing.toString())

  return thirdHashing.toString()
}
