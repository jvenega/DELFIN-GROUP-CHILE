import { useMemo } from "react";
import { Laptop, Activity, Wrench, Trash2 } from "lucide-react";

export default function Stats() {
  const stats = useMemo(
    () => [
      { title: "Equipos", value: 120, icon: Laptop },
      { title: "En uso", value: 85, icon: Activity },
      { title: "En mantenimiento", value: 10, icon: Wrench },
      { title: "Bajas", value: 25, icon: Trash2 },
    ],
    []
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-600">
                {item.title}
              </p>
              <Icon className="w-5 h-5 text-gray-400" />
            </div>

            <p className="text-2xl font-bold text-gray-900">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}