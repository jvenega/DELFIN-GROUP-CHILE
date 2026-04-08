// src/core/ui/FullScreenLoader.jsx
export default function FullScreenLoader({ message = "Cargando..." }) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <p className="text-gray-600">{message}</p>
    </div>
  );
}
