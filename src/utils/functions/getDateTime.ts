import { getApi } from '@dasig/api'

export default async () => {
  const [response, responseError] = await getApi('9b8252593c09cbd0533d')
  if (responseError !== null) return
  return response.result
}
