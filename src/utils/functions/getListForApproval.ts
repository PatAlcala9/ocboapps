import { getApi } from '@dasig/api'

export default async (division: string) => {
  let response
  if (division === 'electrical') {
    ;[response] = await getApi('c7ff01623b3d85b64b24')
  } else if (division === 'occupancy') {
    ;[response] = await getApi('8b4522124dc77a61ff73')
  } else if (division === 'mechanical') {
    ;[response] = await getApi('ecb4eff422707e15cc1f')
  }
  return [response.result, response.result2]
}
