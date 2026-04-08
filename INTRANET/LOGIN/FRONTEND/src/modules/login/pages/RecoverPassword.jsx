import { useEffect, useMemo, useRef, useState, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiResetPassword } from "@core/api/apiAuth";

import RecoverHeader from "../components/recoverpassword/RecoverHeader";
import OtpStep from "../components/recoverpassword/OtpStep";
import PasswordStep from "../components/recoverpassword/PasswordStep";
import SuccessStep from "../components/recoverpassword/SuccessStep";

import { STEP, EMPTY_OTP } from "../components/recoverpassword/constants";

import { ArrowLeft, AlertCircle } from "lucide-react";

/* =====================
   REDUCER
===================== */

const initialState = {
  step: STEP.CODE,
  status: "idle",
  error: "",
  otp: [...EMPTY_OTP],
  password: "",
  confirm: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_OTP":
      return { ...state, otp: action.payload };

    case "SET_PASSWORD":
      return { ...state, password: action.payload };

    case "SET_CONFIRM":
      return { ...state, confirm: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_STATUS":
      return { ...state, status: action.payload };

    case "SET_STEP":
      return { ...state, step: action.payload };

    case "RESET_OTP":
      return { ...state, otp: [...EMPTY_OTP] };

    default:
      return state;
  }
}

export default function RecoverPassword() {

  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const [correo] = useState(
    () => location.state?.correo || localStorage.getItem("recoverEmail") || ""
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  const { step, status, error, otp, password, confirm } = state;

  const inputsRef = useRef([]);

  const otpValue = otp.join("");
  const otpValid = otpValue.length === 6;

  /* =====================
     OTP HANDLERS
  ===================== */

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;

    dispatch({ type: "SET_OTP", payload: next });

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");

    if (pasted.length === 6) {
      dispatch({ type: "SET_OTP", payload: pasted.split("") });
      inputsRef.current[5]?.focus();
    }
  };

  /* =====================
     PASSWORD RULES
  ===================== */

  const rules = useMemo(
    () => [
      {
        label: "Exactamente 8 caracteres",
        valid: password.length === 8,
      },
      {
        label: "Al menos una mayúscula",
        valid: /[A-Z]/.test(password),
      },
      {
        label: "Al menos un número",
        valid: /\d/.test(password),
      },
    ],
    [password]
  );

  const passwordValid = rules.every((r) => r.valid);

  const match = password && confirm && password === confirm;

  /* =====================
     SUCCESS REDIRECT
  ===================== */

  useEffect(() => {
    if (step === STEP.SUCCESS) {
      const t = setTimeout(() => {
        localStorage.removeItem("recoverEmail");
        navigate("/login", { replace: true });
      }, 3000);

      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  /* =====================
     SUBMIT PASSWORD
  ===================== */

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    dispatch({ type: "SET_ERROR", payload: "" });

    if (!passwordValid) {
      dispatch({
        type: "SET_ERROR",
        payload:
          "La contraseña debe tener exactamente 8 caracteres, una mayúscula y un número.",
      });
      return;
    }

    if (!match) {
      dispatch({
        type: "SET_ERROR",
        payload: "Las contraseñas no coinciden.",
      });
      return;
    }

    try {
      dispatch({ type: "SET_STATUS", payload: "loading" });

      await apiResetPassword(correo, otpValue, password);

      dispatch({ type: "SET_STEP", payload: STEP.SUCCESS });

    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err.message || "Código inválido o expirado.",
      });

      dispatch({ type: "SET_STEP", payload: STEP.CODE });
      dispatch({ type: "RESET_OTP" });

    } finally {
      dispatch({ type: "SET_STATUS", payload: "idle" });
    }
  };

  /* =====================
     INVALID SESSION
  ===================== */

  if (!correo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 to-slate-800 p-4 text-white">
        <div className="w-full max-w-md rounded-2xl bg-slate-800/70 backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/15">
            <AlertCircle size={28} className="text-red-400" />
          </div>

          <h1 className="text-xl font-semibold mb-2">
            Sesión de recuperación no válida
          </h1>

          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-xl py-3 font-semibold bg-blue-600 hover:bg-blue-700 transition"
          >
            Volver al inicio de sesión
          </button>

        </div>
      </div>
    );
  }

  /* =====================
     UI
  ===================== */

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 to-slate-800 p-4 sm:p-6 text-white">

      <div className="w-full max-w-md sm:max-w-lg rounded-2xl bg-slate-800/70 backdrop-blur-xl border border-white/10 shadow-2xl p-6 sm:p-8">

        {step !== STEP.SUCCESS && (
          <button
            onClick={() => navigate("/login", { replace: true })}
            className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} /> Volver
          </button>
        )}

        <RecoverHeader step={step} />

        {step === STEP.CODE && (
          <OtpStep
            otp={otp}
            otpValid={otpValid}
            error={error}
            handlePaste={handlePaste}
            handleOtpChange={handleOtpChange}
            handleKeyDown={handleKeyDown}
            inputsRef={inputsRef}
            setStep={(s) => dispatch({ type: "SET_STEP", payload: s })}
            STEP={STEP}
          />
        )}

        {step === STEP.PASSWORD && (
          <PasswordStep
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            password={password}
            confirm={confirm}
            setPassword={(value) =>
              dispatch({ type: "SET_PASSWORD", payload: value })
            }
            setConfirm={(value) =>
              dispatch({ type: "SET_CONFIRM", payload: value })
            }
            match={match}
            rules={rules}
            error={error}
            status={status}
            handleSubmitPassword={handleSubmitPassword}
          />
        )}

        {step === STEP.SUCCESS && (
          <SuccessStep navigate={navigate} />
        )}

      </div>

    </div>
  );
}