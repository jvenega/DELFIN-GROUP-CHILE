import { useState, useRef, useEffect, useMemo, useCallback } from "react";

/* ======================================================
   VALIDADORES
====================================================== */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const cleanRut = (value = "") =>
  value.replace(/[^0-9kK]/g, "").toUpperCase();

const formatRut = (value = "") => {
  const clean = cleanRut(value);
  if (clean.length < 2) return clean;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  return (
    body
      .split("")
      .reverse()
      .reduce((acc, char, i) => {
        if (i > 0 && i % 3 === 0) acc = "." + acc;
        return char + acc;
      }, "") +
    "-" +
    dv
  );
};

const normalizeRut = (value = "") => {
  const clean = cleanRut(value);
  if (clean.length < 2) return clean;

  return `${clean.slice(0, -1)}-${clean.slice(-1)}`;
};

const isValidRutFormat = (value = "") =>
  /^[0-9]{7,8}-[0-9kK]$/.test(value);

/* ======================================================
   HOOK
====================================================== */

export function useLoginForm({
  username,
  password,
  setUsername,
  setPassword,
  maxPasswordLength,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const inputRef = useRef(null);

  /* ======================================================
     FOCUS INICIAL
  ====================================================== */

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* ======================================================
     DERIVED STATE (MEMO)
     Evita recalcular en cada render
  ====================================================== */

  const isRut = useMemo(
    () => !/[a-zA-Z@]/.test(username),
    [username]
  );

  const userValid = useMemo(() => {
    return isRut
      ? isValidRutFormat(username)
      : emailRegex.test(username);
  }, [username, isRut]);

  const passValid = useMemo(() => {
    return (
      password.length > 0 &&
      password.length <= maxPasswordLength
    );
  }, [password, maxPasswordLength]);

  /* ======================================================
     HANDLERS MEMOIZADOS
  ====================================================== */

  const handleUserChange = useCallback(
    (e) => {
      const value = e.target.value;

      /* EMAIL */
      if (/[a-zA-Z@]/.test(value)) {
        setUsername(value);
        return;
      }

      /* RUT */
      if (!/^[0-9kK.\\-]*$/.test(value)) return;

      const clean = cleanRut(value);

      if (clean.length > 9) return;

      setUsername(normalizeRut(clean));
    },
    [setUsername]
  );

  const handlePasswordChange = useCallback(
    (value) => {
      if (value.length <= maxPasswordLength) {
        setPassword(value);
      }
    },
    [setPassword, maxPasswordLength]
  );

  /* ======================================================
     SUBMIT HANDLER
  ====================================================== */

  const submit = useCallback(
    (cb) => (e) => {
      e.preventDefault();

      setSubmitted(true);

      if (!userValid || !passValid) return;

      cb(e);
    },
    [userValid, passValid]
  );

  /* ======================================================
     RETURN
  ====================================================== */

  return {
    /* refs */
    inputRef,

    /* state */
    isRut,
    userValid,
    passValid,
    submitted,
    showPassword,

    /* actions */
    setShowPassword,
    handleUserChange,
    handlePasswordChange,
    formatRut,
    submit,
  };
}