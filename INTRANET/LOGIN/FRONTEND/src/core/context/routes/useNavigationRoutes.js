import { useContext } from "react";
import { NavigationContext } from "./NavigationContext";

export function useNavigationRoutes() {
  return useContext(NavigationContext);
}