import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  AnimatePresence,
  LazyMotion,
  // eslint-disable-next-line no-unused-vars
  m,
  domAnimation,
} from "framer-motion";

import { memo, useCallback, useContext, useMemo } from "react";

import { LoginConfig } from "../../styles/Layout.auth";
import { useLoginForm } from "../../hooks/useLoginForm";
import { AuthContext } from "@core/context/Auth/AuthContext";

/*
========================================================
LOGIN FORM (ROBUSTO + UX CONSISTENTE + PRIORIDAD ESTADOS)
========================================================
*/

function LoginForm(props) {

  const {
    username,
    password,
    setUsername,
    setPassword,
    setShowRecover,
    loading,
    handleSubmit,
    loginErrorCode,
  } = props;

  const { auth } = LoginConfig;
  const { form } = auth.login;

  /* =====================
     CONTEXTO AUTH
  ===================== */

  const {
    isBlocked,
    getRemainingBlockTime,
    attempts,
  } = useContext(AuthContext);

  /* =====================
     FORM HOOK
  ===================== */

  const {
    inputRef,
    isRut,
    userValid,
    submitted,
    showPassword,
    setShowPassword,
    handleUserChange,
    handlePasswordChange,
    formatRut,
    submit,
  } = useLoginForm({
    username,
    password,
    setUsername,
    setPassword,
    maxPasswordLength: form.maxPasswordLength,
  });

  const hasBackendError = Boolean(loginErrorCode);

  /* =====================
     PASSWORD STATE (FIX)
  ===================== */

  const passwordLength = password.length;

  const passwordState = useMemo(() => {
    if (isBlocked || hasBackendError) return "error";

    if (!submitted && passwordLength === 0) return "idle";
    if (passwordLength === 0) return "error";
    if (passwordLength > form.maxPasswordLength) return "error";

    return "valid";
  }, [
    passwordLength,
    submitted,
    form.maxPasswordLength,
    isBlocked,
    hasBackendError,
  ]);

 

  /* =====================
     COLORES Y BORDES
  ===================== */

  const userBorder = useMemo(() => {
    if (isBlocked || hasBackendError) return "border-red-500";

    if (!submitted) return "border-white/20 focus:border-blue-500";

    return userValid ? "border-emerald-500" : "border-red-500";
  }, [submitted, userValid, hasBackendError, isBlocked]);

  const passwordBorder = useMemo(() => {
    if (isBlocked || hasBackendError) return "border-red-500";

    return {
      idle: "border-white/20 focus:border-blue-500",
      valid: "border-emerald-500",
      error: "border-red-500",
    }[passwordState];
  }, [passwordState, hasBackendError, isBlocked]);

  

  /* =====================
     HANDLERS
  ===================== */

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, [setShowPassword]);

  const onRecover = useCallback(() => {
    setShowRecover(true);
  }, [setShowRecover]);

  const onPasswordChange = useCallback(
    (e) => {
      const value = e.target.value;

      if (value.length <= form.maxPasswordLength) {
        handlePasswordChange(value);
      }
    },
    [handlePasswordChange, form.maxPasswordLength]
  );

  const isDisabled = loading || isBlocked;

  /* =====================
     RENDER
  ===================== */

  return (
    <LazyMotion features={domAnimation}>

      <form
        onSubmit={submit(handleSubmit)}
        className="space-y-5"
      >

        {/* USER */}

        <div className="relative">

          <Mail className={form.inputIcon} size={18} />

          <input
            ref={inputRef}
            type="text"
            placeholder={form.messages.userPlaceholder}
            value={isRut ? formatRut(username) : username}
            onChange={handleUserChange}
            autoComplete="username"
            disabled={isBlocked}
            className={`${form.inputBase} ${userBorder} ${
              isBlocked ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />

        </div>

        <AnimatePresence initial={false}>
          {submitted && !userValid && (
            <m.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className={form.error}
            >
              <AlertCircle size={14} />
              {isRut
                ? form.messages.invalidRut
                : form.messages.invalidEmail}
            </m.div>
          )}
        </AnimatePresence>

        {/* PASSWORD */}

        <div className="relative">

          <Lock className={form.inputIcon} size={18} />

          <input
            type={showPassword ? "text" : "password"}
            placeholder={`Contraseña (máx. ${form.maxPasswordLength})`}
            value={password}
            onChange={onPasswordChange}
            autoComplete="current-password"
            disabled={isBlocked}
            className={`${form.inputPassword} ${passwordBorder} ${
              isBlocked ? "opacity-60 cursor-not-allowed" : ""
            }`}
          />

          <button
            type="button"
            onClick={togglePassword}
            className={form.togglePassword}
            disabled={isBlocked}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>

        </div>

        {/* MENSAJE PASSWORD */}

        

        {/* BLOQUEO */}

        {isBlocked && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-400 text-center"
          >
            Intenta nuevamente en {getRemainingBlockTime()}s
          </m.div>
        )}

        {/* WARNING */}

        {!isBlocked && attempts === 2 && (
          <div className="text-sm text-yellow-400 text-center">
            Último intento antes de bloquear tu cuenta
          </div>
        )}

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={isDisabled}
          className={`${form.submit} ${
            isDisabled
              ? form.submitDisabled
              : form.submitEnabled
          }`}
        >

          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {form.messages.loading}
            </>
          ) : isBlocked ? (
            <>
              <AlertCircle size={18} />
              Bloqueado
            </>
          ) : (
            <>
              <LogIn size={18} />
              {form.messages.submit}
            </>
          )}

        </button>

        {/* RECOVER */}

        <button
          type="button"
          onClick={onRecover}
          className={form.recover}
          disabled={isBlocked}
        >
          ¿Olvidó su contraseña?
        </button>

      </form>

    </LazyMotion>
  );
}

export default memo(LoginForm);