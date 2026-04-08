import { useEffect, useState, useCallback } from "react";

// ==============================
// NORMALIZADOR UNIVERSAL
// ==============================
function normalizeResponse(input) {
  if (!input) return [];

  // Si ya es array
  if (Array.isArray(input)) return input;

  // Si es objeto → buscar recursivamente
  if (typeof input === "object") {
    for (const key in input) {
      const value = input[key];

      if (Array.isArray(value)) {
        return value;
      }

      if (typeof value === "object" && value !== null) {
        const nested = normalizeResponse(value);
        if (Array.isArray(nested)) {
          return nested;
        }
      }
    }
  }

  return [];
}

// ==============================
// HOOK GENÉRICO (READ)
// ==============================
export function useApi(fn, deps = [], options = {}) {
  const { immediate = true } = options;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await fn();

      // 🔥 NORMALIZACIÓN AUTOMÁTICA
      const normalized = normalizeResponse(result);

      setData(normalized);

    } catch (err) {
      setError({
        message: err.message || "Error inesperado",
      });
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => {
    if (immediate) execute();
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    refetch: execute,
    setData,
  };
}

// ==============================
// HOOK MUTATION (POST / PUT)
// ==============================
export function useMutation(fn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (payload) => {
    try {
      setLoading(true);
      setError(null);

      const result = await fn(payload);
      return result;

    } catch (err) {
      setError({
        message: err.message || "Error inesperado",
      });
      throw err;

    } finally {
      setLoading(false);
    }
  };

  return {
    execute,
    loading,
    error,
  };
}