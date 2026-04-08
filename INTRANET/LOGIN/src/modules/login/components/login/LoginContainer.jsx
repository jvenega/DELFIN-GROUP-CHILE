/* eslint-disable no-unused-vars */
import { AnimatePresence, m } from "framer-motion";
import LoginHeader from "./LoginHeader";
import LoginForm from "./LoginForm";
import RecoverForm from "../RecoverForm";

export default function LoginContainer({
  loginState = {},
  loginConfig = {},
  animationCtx = {},
}) {

  /* =====================
     SAFE STATE EXTRACTION
  ===================== */

  const {
    username = "",
    password = "",
    recoverValue = "",
    loading = false,
    showRecover = false,
    setUsername = () => {},
    setPassword = () => {},
    setRecoverValue = () => {},
    setShowRecover = () => {},
    handleSubmit = () => {},
    handleRecover = () => {},
  } = loginState;

  const formVariants = loginConfig?.animation?.variants?.form || {};

  /* =====================
     UI
  ===================== */

  return (
    <div className="relative z-10 min-h-screen grid lg:grid-cols-[1fr_1.4fr]">

      {/* LEFT PANEL */}
      <div className="flex items-center justify-center px-6 sm:px-10 py-12 lg:py-0 bg-[#0B1B33]">

        <div className="w-full max-w-md">

          {/* HEADER */}
          <LoginHeader
            showRecover={showRecover}
            loginConfig={loginConfig}
            animationCtx={animationCtx}
          />

          {/* FORMS */}
          <AnimatePresence mode="wait">

            {!showRecover ? (

              <m.div
                key="login-form"
                variants={formVariants}
                custom={animationCtx}
                initial="hidden"
                animate="visible"
                exit="exit"
              >

                <LoginForm
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  setShowRecover={setShowRecover}
                  loading={loading}
                  handleSubmit={handleSubmit}
                />

              </m.div>

            ) : (

              <m.div
                key="recover-form"
                variants={formVariants}
                custom={animationCtx}
                initial="hidden"
                animate="visible"
                exit="exit"
              >

                <RecoverForm
                  recoverValue={recoverValue}
                  setRecoverValue={setRecoverValue}
                  setShowRecover={setShowRecover}
                  loading={loading}
                  handleRecover={handleRecover}
                />

              </m.div>

            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}