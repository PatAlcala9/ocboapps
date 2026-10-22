type BackendType = {
  url: string
}

type RequestType = {
  retries: number
  retry_codes: number[]
}

const api = {
  backend: {
    url: 'http://localhost:4000/api/',
    // url: 'https://ocboapps.davaocity.gov.ph/esign-server/api/',
  } satisfies BackendType,

  request: {
    retries: 3,
    retry_codes: [400, 404, 405, 500, 502],
  } satisfies RequestType,
}

export { api as default }
