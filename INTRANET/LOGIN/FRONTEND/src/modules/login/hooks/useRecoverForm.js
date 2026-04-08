import { useRef, useEffect } from "react";

/* =============================
   VALIDADORES
============================= */
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cleanRut = (v = "") =>
  v.replace(/[^0-9kK]/g, "").toUpperCase();

const formatRut = (v = "") => {
  const clean = cleanRut(v);
  if (clean.length < 2) return clean;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  return (
    body
      .split("")
      .reverse()
      .reduce((acc, c, i) => {
        if (i > 0 && i % 3 === 0) acc = "." + acc;
        return c + acc;
      }, "") + "-" + dv
  );
};

const normalizeRut = (v = "") => {
  const clean = cleanRut(v);
  if (clean.length < 2) return clean;
  return `${clean.slice(0, -1)}-${clean.slice(-1)}`;
};

const isValidRut = (v = "") =>
  /^[0-9]{7,8}-[0-9kK]$/.test(v);

/* =============================
   Hook
============================= */
export function useRecoverForm({
  recoverValue,
  setRecoverValue,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isRut = !/[a-zA-Z@]/.test(recoverValue);

  const isValid = isRut
    ? isValidRut(recoverValue)
    : emailRegex.test(recoverValue);

  const hasValue = recoverValue.trim().length > 0;

  const handleChange = (e) => {
    let value = e.target.value;

    // Email / usuario libre
    if (/[a-zA-Z@]/.test(value)) {
      setRecoverValue(value);
      return;
    }

    // Solo RUT
    if (!/^[0-9kK.\-]*$/.test(value)) return;

    const clean = cleanRut(value);
    if (clean.length > 9) return;

    setRecoverValue(normalizeRut(clean));
  };

  const submit = (cb) => (e) => {
    e.preventDefault();
    if (!isValid) return;
    cb(e);
  };

  return {
    inputRef,
    isRut,
    isValid,
    hasValue,
    formatRut,
    handleChange,
    submit,
  };
}
