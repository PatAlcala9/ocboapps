import { getApi } from '@dasig/api'

export default async (id: string) => {
  const [response, responseError] = await getApi('49dd42b9454f27280be0', id)
  if (responseError !== null) return
  return response.result
}
