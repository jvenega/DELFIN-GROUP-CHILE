import SubAppFrame from "../subapps/SubAppFrame";
import * as Icons from "lucide-react";

/* =========================================================
   Helpers
========================================================= */



function resolveIcon(iconName, embed) {

  if (typeof iconName === "string") {

    const cleaned = iconName
      .replace(/Icon$/i, "") // 👈 clave
      .trim()
      .replace(/[-_\s]/g, "")
      .toLowerCase();

    const match = Object.keys(Icons).find(
      key => key.toLowerCase() === cleaned
    );

    if (match) return Icons[match];
  }

  return embed ? Icons.Boxes : Icons.ExternalLink;
}

/* =========================================================
   Builder
========================================================= */

export function buildExternalRoutes(input = []) {

  const apps = Array.isArray(input)
    ? input
    : Array.isArray(input.apps)
      ? input.apps
      : [];


  return apps
    .filter(Boolean)
    .filter(app => !!app?.origin)
    .map((app, index) => {
      const label = app?.name || "Aplicación";
      const path = app?.path || `/${app?.id || index}`;
      const src = app?.origin;

      return {
        path,
        type: "internal",
        roles: (app?.roles || []).map(r => String(r).toUpperCase()),

        menu: {
          label,
          icon: resolveIcon(app?.icon, true),
          order: app?.menuOrder ?? 999,
        },

        externalApp: true,
        src,
        provider: app?.id || `app-${index}`,
        embed: true,

        element: SubAppFrame,
        elementProps: {
          src,
          appId: app?.id,
        },
      };
    })
    .sort((a, b) => (a.menu.order ?? 999) - (b.menu.order ?? 999));
}