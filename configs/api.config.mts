const api = {
  backend: {
    // url: "http://localhost:4000/api/"
    url: 'https://ocboapps.davaocity.gov.ph/esign-server/api/',
  },

  request: {
    retries: 3,
    retry_codes: [400, 404, 405, 500, 502],
  },
}

export { api as default }
