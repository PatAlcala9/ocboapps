import { ofetch } from 'ofetch'
import api from 'configs/api.config'

const API = api.backend.url

export default async (application: string) => {
  try {
    const fetch = await ofetch(API + `pops/statusOP/${application}/check-status-pops`, { parseResponse: JSON.parse, retry: 3, retryDelay: 500, retryStatusCodes: [400, 404, 405, 500, 502] })
    const result = fetch
    return result
  } catch {
    return null
  }
}
