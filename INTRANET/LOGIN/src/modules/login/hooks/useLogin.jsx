import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@context/Auth/useAuth";
import toast from "react-hot-toast";
import { loginSchema, recoverSchema } from "@core/auth/schemas/authSchemas";
import { apiRecovery } from "@core/api/apiAuth";

/* =====================================================
   AUTH STATUS
===================================================== */
const AUTH_STATUS = {
  IDLE: "idle",
  LOGIN_SUBMITTING: "login_submitting",
  RECOVER_SUBMITTING: "recover_submitting",
  ERROR: "error",
};

export function useLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  /* =====================
     FORM STATE
  ===================== */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recoverValue, setRecoverValue] = useState("");
  const [showRecover, setShowRecover] = useState(false);

  /* =====================
     FLOW STATE
  ===================== */
  const [status, setStatus] = useState(AUTH_STATUS.IDLE);
  const loading =
    status === AUTH_STATUS.LOGIN_SUBMITTING ||
    status === AUTH_STATUS.RECOVER_SUBMITTING;

  /* =====================
     ERROR STATE (CLAVE)
  ===================== */
  const [loginErrorCode, setLoginErrorCode] = useState(null);

  /* =====================
     UX: LAST USER
  ===================== */
  useEffect(() => {
    const savedUser = localStorage.getItem("lastUser");
    if (savedUser) setUsername(savedUser);
  }, []);

  /* =====================
     LIMPIAR ERROR (MEJORADO)
     👉 solo cuando usuario empieza nuevo intento
  ===================== */
  const clearError = useCallback(() => {
    if (loginErrorCode) {
      setLoginErrorCode(null);
    }
  }, [loginErrorCode]);

  /* =====================
     LOGIN
  ===================== */
  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (loading) return;

      const parsed = loginSchema.safeParse({
        username,
        password,
      });

      if (!parsed.success) {
        return toast.error(parsed.error.errors[0].message);
      }

      setStatus(AUTH_STATUS.LOGIN_SUBMITTING);
      setLoginErrorCode(null);

      try {
        await login(username.trim(), password);

        localStorage.setItem("lastUser", username.trim());

        // 🔴 NUEVO: obtener redirect desde la URL
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");

        // 🔴 OPCIÓN ROBUSTA (recomendada)
        if (redirect && redirect.startsWith("/intranet")) {
          window.location.replace(redirect);
        } else {
          navigate("/dashboard", { replace: true });
        }

      } catch (err) {

        const code =
          err?.response?.data?.code ||
          err?.code ||
          "INVALID_CREDENTIALS";

        setLoginErrorCode(code);
        setStatus(AUTH_STATUS.ERROR);

      } finally {
        setStatus(AUTH_STATUS.IDLE);
      }
    },
    [username, password, loading, login, navigate]
  );

  /* =====================
     RECOVER
  ===================== */
  const handleRecover = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (loading) return;

      const value = recoverValue.trim();

      const parsed = recoverSchema.safeParse({ correo: value });
      if (!parsed.success) {
        return toast.error(parsed.error.errors[0].message);
      }

      setStatus(AUTH_STATUS.RECOVER_SUBMITTING);
      setLoginErrorCode(null);

      try {
        const { message, estado } = await apiRecovery(value);

        if (estado === "NO") {
          setLoginErrorCode("RECOVER_FAILED");
          toast.error(message || "No fue posible procesar la solicitud");
          setStatus(AUTH_STATUS.ERROR);
          return;
        }

        toast.success(message || "Solicitud enviada correctamente");

        navigate("/recover-password", {
          replace: true,
          state: { correo: value },
        });

      } catch (err) {
        toast.error(err?.message || "Error inesperado");
        setStatus(AUTH_STATUS.ERROR);

      } finally {
        setStatus((prev) =>
          prev === AUTH_STATUS.ERROR ? AUTH_STATUS.ERROR : AUTH_STATUS.IDLE
        );
      }
    },
    [recoverValue, loading, navigate]
  );

  /* =====================
     API
  ===================== */
  return {
    username,
    password,
    recoverValue,
    loading,
    showRecover,
    loginErrorCode,

    setUsername: (v) => {
      clearError();
      setUsername(v);
    },

    setPassword: (v) => {
      clearError();
      setPassword(v);
    },

    setRecoverValue,
    setShowRecover,

    handleSubmit,
    handleRecover,
  };
}