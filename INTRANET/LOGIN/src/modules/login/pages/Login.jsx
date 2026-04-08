/* eslint-disable no-unused-vars */
import { LazyMotion, m, domAnimation, AnimatePresence } from "framer-motion";
import { useLogin } from "../hooks/useLogin";
import { LoginConfig } from "../styles/Layout.auth";

import LoginContainer from "../components/login/LoginContainer";
import LoginBackground from "../components/login/LoginBackground";
import LoadingOverlay from "../components/overlay/LoadingOverlay";

export default function Login() {

  /* =====================
     STATE
  ===================== */

  const loginState = useLogin() || {};
  const { loading = false } = loginState;

  const { auth } = LoginConfig || {};
  const { login = {} } = auth || {};

  /* =====================
     ANIMATION CONTEXT SAFE
  ===================== */

  const animationCtx = {
    ease: login?.animation?.easeSmooth || "easeOut",
    ...(login?.animation?.duration || {}),
  };

  /* =====================
     FALLBACK UI (CRITICAL)
  ===================== */

  if (!loginState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <span>Error al cargar el login</span>
      </div>
    );
  }

  /* =====================
     UI
  ===================== */

  return (
    <LazyMotion features={domAnimation} strict>

      <m.div
        className="relative min-h-screen w-full overflow-hidden text-white"
        variants={login?.animation?.variants?.page}
        custom={animationCtx}
        initial="hidden"
        animate="visible"
      >

        {/* BACKGROUND (SAFE RENDER) */}
        {LoginBackground && <LoginBackground />}

        {/* MAIN CONTAINER */}
        <LoginContainer
          loginState={loginState}
          loginConfig={login}
          animationCtx={animationCtx}
        />

        {/* LOADING OVERLAY */}
        <AnimatePresence mode="wait">
          {loading && <LoadingOverlay text="Validando Credenciales..." />}
        </AnimatePresence>

      </m.div>

    </LazyMotion>
  );
}