type WebsiteType = {
  name: string
  short_name: string
  description: string
  developer: string
  designer: string
}

type FontType = {
  name: 'inter' | 'roboto' | 'montserrat' | 'opensans' | 'publicsans'
  local: boolean
}

type CopyrightType = {
  name: string
  year: number
  color: string
}

type LicenseType = {
  type: 'mit' | 'gpl' | 'apache'
}

type CacheType = {
  enabled: boolean
}

const site = {
  website: {
    name: 'Office of the City Building Official Applications',
    short_name: 'OCBO Apps',
    description: 'An Online Portal to Office of the City Building Official Applications',
    developer: 'Patrick Alvin Alcala',
    designer: 'Patrick Alvin Alcala',
  } satisfies WebsiteType,

  font: {
    name: 'inter',
    local: false,
  } satisfies FontType,

  copyright: {
    name: 'Office of the City Building Official',
    year: 2026,
    color: '#ffffffff',
  } satisfies CopyrightType,

  license: {
    type: 'mit',
  } satisfies LicenseType,

  cache: {
    enabled: true,
  } satisfies CacheType,
}

export { site as default }
