// ==============================
// CONFIG DESDE .ENV
// ==============================
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CACHE_TTL =
  Number(import.meta.env.VITE_CACHE_TTL) || 5 * 60 * 1000;
const DEFAULT_TIMEOUT =
  Number(import.meta.env.VITE_TIMEOUT) || 10000;

// Validación crítica
if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL no está definido en el .env");
}

// ==============================
// CACHE EN MEMORIA
// ==============================
const cache = {};

// ==============================
// FETCH BASE
// ==============================
async function fetchData(endpoint, options = {}) {
  const url = `${BASE_URL}/${endpoint}`;

  const {
    method = "GET",
    body,
    headers = {},
    useCache = true,
    timeout = DEFAULT_TIMEOUT,
    signal,
  } = options;

  const cacheKey = `${method}:${endpoint}`;

  // ==============================
  // CACHE
  // ==============================
  if (useCache && method === "GET" && cache[cacheKey]) {
    const { data, timestamp } = cache[cacheKey];

    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: signal || controller.signal,
    });

    clearTimeout(timeoutId);

    const json = await res.json();

    // ==============================
    // VALIDACIÓN RESPUESTA BACKEND
    // ==============================
    if (!res.ok || !json.ok) {
      throw new Error(json.message || `HTTP ${res.status}`);
    }

    // ==============================
    // CACHE STORE
    // ==============================
    if (useCache && method === "GET") {
      cache[cacheKey] = {
        data: json.data,
        timestamp: Date.now(),
      };
    }

    return json.data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.error(`Timeout en ${endpoint}`);
    } else {
      console.error(`API Error [${endpoint}]`, error);
    }

    throw error;
  }
}

// ==============================
// MÉTODOS HTTP
// ==============================
const get = (endpoint, options) =>
  fetchData(endpoint, { ...options, method: "GET" });

const post = (endpoint, body, options) =>
  fetchData(endpoint, {
    ...options,
    method: "POST",
    body,
    useCache: false,
  });

const put = (endpoint, body, options) =>
  fetchData(endpoint, {
    ...options,
    method: "PUT",
    body,
    useCache: false,
  });

// ==============================
// UTILIDAD QUERY PARAMS
// ==============================
const buildQuery = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return query ? `?${query}` : "";
};

// ==============================
// API
// ==============================
export const api = {
  // ==========================
  // CATÁLOGOS
  // ==========================
  estados: () => get("estados"),
  marcas: () => get("marcas"),
  modelos: () => get("modelos"),
  proveedores: () => get("proveedores"),
  sucursales: () => get("sucursales"),
  tipos: () => get("tipos"),
  movimientos: () => get("movimientos"),

  // ==========================
  // ARTICULOS (CON FILTROS)
  // ==========================
  articulos: (filters = {}) =>
    get(`articulos${buildQuery(filters)}`),

  createArticulo: (data) => post("articulos", data),

  updateArticulo: (serie, data) =>
    put(`articulos/${serie}`, data),

  // ==========================
  // MOVIMIENTOS
  // ==========================
  createMovimiento: (data) =>
    post("movimientos", data),

  // ==========================
  // PERSONAS (RRHH)
  // ==========================
  getPersona: (rut) =>
    get(`personas/${rut}`),

  upsertPersona: (data) =>
    post("personas", data),

  // ==========================
  // ESTADOS (CRUD)
  // ==========================
  createEstado: (data) =>
    post("estados", data),

  updateEstado: (id, data) =>
    put(`estados/${id}`, data),

  // ==========================
  // PROVEEDORES
  // ==========================
  createProveedor: (data) =>
    post("proveedores", data),
};

// ==============================
// UTILIDADES CACHE
// ==============================
export const clearCache = () => {
  Object.keys(cache).forEach((k) => delete cache[k]);
};

export const invalidate = (endpoint, method = "GET") => {
  const key = `${method}:${endpoint}`;
  delete cache[key];
};