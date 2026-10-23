import dayjs from 'dayjs'
import { ofetch } from 'ofetch'
import { encrypt } from '../../services/rsa'
import api from 'configs/api.config.json'
import security from 'configs/security.config.json'
import { uuid } from '../../services/uuid'

const TOKEN_NAME = security.token.name
const TOKEN_EXPIRATION = security.token.expiration
const URL = api.backend.url
const RETRY = api.request.retries
const CODES = api.request.retry_codes

export default async (api: string, body: { [key: string]: unknown }) => {
  const today = new Date()
  const todayUnix = dayjs(today).unix()
  const expiration = todayUnix + TOKEN_EXPIRATION
  const aes = await encrypt(`${api.toString()}-${todayUnix.toString()}-${expiration.toString()}`)
  const postid = uuid()

  const hash = `${TOKEN_NAME}=${aes}token`
  try {
    await ofetch(URL + api, {
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'OCBO-Token': hash,
        'Post-Id': postid,
      },
      retry: RETRY,
      retryDelay: 500,
      retryStatusCodes: CODES,
      method: 'POST',
      body: body,
    })
    return true
  } catch {
    return false
  }
}
