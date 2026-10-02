import { postApi } from '@dasig/api'

export default async (id: number, password: string) => {
  await postApi('48e0a71f62-2c08e8f588', {
    data: password,
    data2: id,
  })
}
