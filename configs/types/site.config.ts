// oxlint-disable no-unused-vars

type WebsiteType = {
  name: string
  short_name: string
  description: string
  developer: string
  designer: string
}

type FontType = {
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
