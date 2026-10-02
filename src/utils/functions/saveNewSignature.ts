import { postApi } from '@dasig/api'

export default async (id: number, signature: string) => {
  await postApi('48e0a71f62-87b0b0c8ee', {
    data: signature,
    data2: id,
  })
}
