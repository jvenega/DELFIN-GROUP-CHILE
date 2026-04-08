const toNumber = (value, fallback) => {
  const n = Number(value);
  return isNaN(n) ? fallback : n;
};

export const SubAppConfig = {
  MIN_CHECK_TIME: toNumber(import.meta.env.VITE_SUBAPP_MIN_CHECK_TIME, 1200),
  CACHE_TTL: toNumber(import.meta.env.VITE_SUBAPP_CACHE_TTL, 30000),
  IFRAME_POOL_LIMIT: toNumber(import.meta.env.VITE_SUBAPP_IFRAME_POOL_LIMIT, 15),
  TIMEOUT: toNumber(import.meta.env.VITE_SUBAPP_TIMEOUT, 3000),

  INTERNAL_ORIGINS: (
    import.meta.env.VITE_INTERNAL_ORIGINS || "localhost,127.0.0.1,192.168"
  )
    .split(",")
    .map(o => o.trim())
};