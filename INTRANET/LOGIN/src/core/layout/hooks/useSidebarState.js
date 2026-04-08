import { useState, useCallback } from "react";

const STORAGE_KEY = "sidebar:collapsed";

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      localStorage.setItem(STORAGE_KEY, !prev);
      return !prev;
    });
  }, []);

  return { collapsed, toggleCollapsed };
}
