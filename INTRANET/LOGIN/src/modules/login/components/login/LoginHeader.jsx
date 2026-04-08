import { AnimatePresence, m } from "framer-motion";
import { KeyRound } from "lucide-react";

export default function LoginHeader({ showRecover, loginConfig, animationCtx }) {

  return (

    <AnimatePresence mode="wait">

      {!showRecover ? (

        <m.div
          key="login-header"
          className="flex flex-col items-center text-center mb-8"
          variants={loginConfig.animation.variants.header}
          custom={animationCtx}
          initial="hidden"
          animate="visible"
          exit="exit"
        >

          <img
            src={loginConfig.assets.logo}
            alt="logo"
            className={loginConfig.header.logo}
          />

          <h1 className={loginConfig.header.title}>
            {loginConfig.texts.title}
          </h1>

        </m.div>

      ) : (

        <m.div
          key="recover-header"
          className="flex flex-col items-center text-center mb-8"
          variants={loginConfig.animation.variants.header}
          custom={animationCtx}
          initial="hidden"
          animate="visible"
          exit="exit"
        >

          <KeyRound size={40} className="text-blue-400" />

          <h2>{loginConfig.texts.recoverTitle}</h2>

        </m.div>

      )}

    </AnimatePresence>

  );
}