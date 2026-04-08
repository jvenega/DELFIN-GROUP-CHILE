import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "@context/Auth/AuthContext";   // 👈 AQUÍ va el import correcto

// Instancia global de React Query
const queryClient = new QueryClient();

export function AppProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider queryClient={queryClient}>
        <BrowserRouter basename="/intranet">
          {children}
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
