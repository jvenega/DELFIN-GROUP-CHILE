import { useApi, useMutation } from "./useApi";
import { api } from "./apiService";

// ==============================
// CATÁLOGOS
// ==============================
export const useEstados = () => useApi(api.estados, []);
export const useMarcas = () => useApi(api.marcas, []);
export const useModelos = () => useApi(api.modelos, []);
export const useProveedores = () => useApi(api.proveedores, []);
export const useSucursales = () => useApi(api.sucursales, []);
export const useTipos = () => useApi(api.tipos, []);
export const useMovimientos = () => useApi(api.movimientos, []);


// ==============================
// ARTICULOS (CON FILTROS)
// ==============================
export const useArticulos = (filters = {}) =>
  useApi(
    () => api.articulos(filters),
    [JSON.stringify(filters)] // evita loops
  );

// ==============================
// PERSONAS
// ==============================
export const usePersona = (rut) =>
  useApi(
    async () => {
      if (!rut) return null;

      const res = await api.getPersona(rut);

      console.log("🔎 API RESPONSE:", res);

      // 🔥 CASO REAL: API devuelve array directo
      if (Array.isArray(res)) {
        return res[0] || null;
      }

      // 🔥 CASO ENVUELTO
      if (res?.data && Array.isArray(res.data)) {
        return res.data[0] || null;
      }

      // 🔥 CASO OBJETO
      if (res?.RUT) {
        return res;
      }

      return null;
    },
    [rut],
    { immediate: !!rut }
  );

// ==============================
// MUTATIONS
// ==============================
export const useCreateEstado = () =>
  useMutation(api.createEstado);

export const useUpdateEstado = () =>
  useMutation(({ id, data }) => api.updateEstado(id, data));

export const useCreateArticulo = () =>
  useMutation(api.createArticulo);

export const useUpdateArticulo = () =>
  useMutation(({ serie, data }) => api.updateArticulo(serie, data));

export const useCreateMovimiento = () =>
  useMutation(api.createMovimiento); // ✅ correcto

export const useUpsertPersona = () =>
  useMutation(api.upsertPersona);

export const useCreateProveedor = () =>
  useMutation(api.createProveedor);