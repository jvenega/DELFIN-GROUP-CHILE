import { Mail, Loader2, Send } from "lucide-react";
import { LoginConfig } from "../styles/Layout.auth";
import { useRecoverForm } from "../hooks/useRecoverForm";

export default function RecoverForm({
  recoverValue = "",
  setRecoverValue = () => {},
  setShowRecover = () => {},
  loading = false,
  handleRecover = () => {},
}) {
  const { auth } = LoginConfig;
  const { recoverForm } = auth.login;

  const {
    inputRef,
    isRut,
    isValid,
    hasValue,
    formatRut,
    handleChange,
    submit,
  } = useRecoverForm({
    recoverValue,
    setRecoverValue,
  });

  return (
    <form
      onSubmit={(e) => submit(handleRecover)(e)}
      className="space-y-5 w-full"
    >
      {/* INPUT */}
      <div className="relative">
        <Mail size={18} className={recoverForm.icon} />

        <input
          ref={inputRef}
          type="text"
          placeholder={recoverForm.messages.placeholder}
          value={isRut ? formatRut(recoverValue) : recoverValue}
          onChange={handleChange}
          autoComplete="username"
          className={`${recoverForm.input} ${
            recoverValue && !isValid
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
              : ""
          }`}
        />
      </div>

      {/* VALIDATION MESSAGE */}
      {recoverValue && !isValid && (
        <div className="text-sm text-red-400">
          {recoverForm.messages.invalid || "Formato inválido"}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading || !hasValue || !isValid}
        className={`${recoverForm.submit} ${
          loading || !hasValue || !isValid
            ? recoverForm.submitDisabled
            : recoverForm.submitEnabled
        }`}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            {recoverForm.messages.loading}
          </>
        ) : (
          <>
            <Send size={18} />
            {recoverForm.messages.submit}
          </>
        )}
      </button>

      {/* BACK */}
      <button
        type="button"
        onClick={() => setShowRecover(false)}
        className={recoverForm.back}
      >
        {recoverForm.messages.back}
      </button>
    </form>
  );
}