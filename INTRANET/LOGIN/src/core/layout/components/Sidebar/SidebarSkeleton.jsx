export default function SidebarSkeleton() {
  return (
    <aside className="w-64 bg-[#0a1124] h-screen flex flex-col border-r border-[#1e2b4d] relative overflow-hidden">

      {/* SHIMMER ANIMATION */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent animate-shimmer pointer-events-none" />

      {/* HEADER / LOGO */}
      <div className="flex items-center justify-center px-6 py-5 border-b border-[#1e2b4d]">
        <div className="w-36 h-8 rounded bg-linear-to-br from-gray-700/60 to-gray-600/40 animate-pulse"></div>
      </div>

      {/* NAVIGATION SKELETON */}
      <nav className="flex-1 mt-6 px-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-2.5 rounded-xl bg-[#1a223d]/60 animate-pulse hover:bg-[#1d2745]/80 transition-colors"
          >
            {/* Icon */}
            <div className="w-5 h-5 bg-gray-500/40 rounded-md"></div>

            {/* Label */}
            <div className="w-28 h-3 rounded bg-gray-500/40"></div>
          </div>
        ))}
      </nav>

      {/* DIVIDER */}
      <div className="px-4 mt-auto mb-4">
        <div className="h-px bg-[#1e2b4d] w-full"></div>
      </div>

      {/* USER PROFILE SKELETON */}
      <div className="px-4 pb-6 flex items-center gap-3 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-gray-600/40 border border-white/10"></div>
        <div className="flex flex-col gap-2">
          <div className="w-24 h-3 rounded bg-gray-500/40"></div>
          <div className="w-16 h-2 rounded bg-gray-500/30"></div>
        </div>
      </div>
    </aside>
  );
}
