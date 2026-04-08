import {
  EyeIcon,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function PasswordStep({
  showPassword = false,
  setShowPassword = () => {},
  password = "",
  confirm = "",
  setPassword = () => {},
  setConfirm = () => {},
  match = false,
  rules = [],
  error = "",
  status = "idle",
  handleSubmitPassword = () => {},
}) {
  return (
    <form
      onSubmit={handleSubmitPassword}
      className="w-full flex flex-col"
    >
      {/* PASSWORD */}
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl bg-slate-700 border border-slate-600 px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
        >
          {showPassword ? <EyeOff size={18} /> : <EyeIcon size={18} />}
        </button>
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Confirmar contraseña"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-xl bg-slate-700 border border-slate-600 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition"
        />
      </div>

      {/* RULES */}
      {Array.isArray(rules) && rules.length > 0 && (
        <div className="mb-4 text-sm space-y-1">
          {rules.map((rule, i) => (
            <div key={i} className="flex items-center gap-2">
              {rule?.valid ? (
                <CheckCircle2 size={16} className="text-emerald-400" />
              ) : (
                <XCircle size={16} className="text-red-400" />
              )}
              <span className="text-slate-300">{rule?.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* MATCH */}
      {confirm && (
        <div
          className={`mb-4 text-sm flex items-center gap-2 ${
            match ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {match ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
          {match
            ? "Las contraseñas coinciden"
            : "Las contraseñas no coinciden"}
        </div>
      )}

      {/* ERROR */}
      {!!error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* BUTTON */}
      <button
        type="submit"
        disabled={!match || status === "loading"}
        className="w-full rounded-xl py-3 font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-40 transition flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          "Actualizar contraseña"
        )}
      </button>
    </form>
  );
}