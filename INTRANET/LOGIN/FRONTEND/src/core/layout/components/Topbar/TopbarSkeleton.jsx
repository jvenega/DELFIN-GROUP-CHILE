export default function TopbarSkeleton() {
  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 flex items-center px-6 relative overflow-hidden">

      {/* SHIMMER */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-gray-200/40 to-transparent animate-shimmer pointer-events-none" />

      {/* BOTÓN MENÚ */}
      <div className="w-8 h-8 rounded-lg bg-gray-300/60 animate-pulse"></div>

      {/* ESPACIO ENTRE ELEMENTOS */}
      <div className="flex-1"></div>

      {/* ACCIONES (ICONOS) */}
      <div className="flex items-center gap-4">
        <div className="w-6 h-6 rounded-md bg-gray-300/60 animate-pulse"></div>
        <div className="w-6 h-6 rounded-md bg-gray-300/60 animate-pulse"></div>
        <div className="w-10 h-10 rounded-full bg-gray-300/60 animate-pulse"></div>
      </div>
    </header>
  );
}
