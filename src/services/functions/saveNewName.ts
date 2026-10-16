import { postApi } from '@dasig/api'

export default async(id: number, name: string) => {
    await postApi('48e0a71f62-66874b9687', {
      data: name,
      data2: id
    })
  }