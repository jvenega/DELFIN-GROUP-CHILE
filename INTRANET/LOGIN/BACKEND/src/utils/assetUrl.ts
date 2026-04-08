const ASSETS_BASE =
  process.env.ASSETS_BASE ||
  "http://192.168.100.45/assets"

export function buildAssetUrl(path: string) {
  if (!path) return null
  return `${ASSETS_BASE}/${path}`
}