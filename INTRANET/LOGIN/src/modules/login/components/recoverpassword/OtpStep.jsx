import { AlertCircle } from "lucide-react";

export default function OtpStep({
  otp = ["", "", "", "", "", ""],
  otpValid = false,
  error = "",
  handlePaste = () => {},
  handleOtpChange = () => {},
  handleKeyDown = () => {},
  inputsRef,
  setStep = () => {},
  STEP,
}) {
  const OTP_INDEXES = [0, 1, 2, 3, 4, 5];

  return (
    <div className="w-full flex flex-col">

      {/* OTP INPUTS */}
      <div
        className="flex justify-center gap-2 sm:gap-3 mb-6"
        onPaste={handlePaste}
      >
        {OTP_INDEXES.map((i) => (
          <input
            key={`otp-${i}`}
            ref={(el) => {
              if (inputsRef?.current) inputsRef.current[i] = el;
            }}
            value={otp[i] || ""}
            maxLength={1}
            inputMode="numeric"
            autoComplete="one-time-code"
            onChange={(e) => handleOtpChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className="
              h-12 w-12 sm:h-14 sm:w-14
              text-center text-lg sm:text-xl font-semibold
              rounded-xl bg-slate-700 border border-slate-600
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30
              outline-none transition
            "
          />
        ))}
      </div>

      {/* ERROR */}
      {!!error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* BUTTON */}
      <button
        type="button"
        disabled={!otpValid}
        onClick={() => setStep(STEP?.PASSWORD)}
        className="
          w-full rounded-xl py-3 font-semibold
          bg-blue-600 hover:bg-blue-700
          disabled:opacity-40 transition
        "
      >
        Continuar
      </button>

    </div>
  );
}