import { getApi } from '@dasig/api'

export default async () => {
  const [check, checkError] = await getApi('3e9e21e59c08b2d5780b')
  if (checkError !== null) return false

  const result = check as boolean
  return result
}
