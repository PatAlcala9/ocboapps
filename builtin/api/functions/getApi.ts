import { ofetch } from 'ofetch'
import api from 'configs/api.config.json'

const URL = api.backend.url
const RETRY = api.request.retries
const CODES = api.request.retry_codes

export default async (api: string, value?: string | number, value2?: string | number) => {
  try {
    let fetch
    if (!value2) {
      if (!value) {
        fetch = await ofetch(URL + api, {
          parseResponse: JSON.parse,
          retry: RETRY,
          retryDelay: 500,
          retryStatusCodes: CODES,
        })
      } else {
        fetch = await ofetch(`${URL}${api}/${value}/${api}`, {
          parseResponse: JSON.parse,
          retry: RETRY,
          retryDelay: 500,
          retryStatusCodes: CODES,
        })
      }
    } else {
      fetch = await ofetch(`${URL}${api}/${value}/${value2}/${api}`, {
        parseResponse: JSON.parse,
        retry: RETRY,
        retryDelay: 500,
        retryStatusCodes: CODES,
      })
    }
    const result = fetch
    return [result, null]
  } catch (error) {
    return [[], error]
  }
}
