// SidebarItem.jsx
import { NavLink } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function SidebarItem({
  route,
  collapsed,
  navbar
}) {
  const Icon = route?.menu?.icon;
  if (!Icon) return null;

  const isExternal = route.type === "external";
  const href = route.externalLink || route.src;

  const baseClass = `
    ${navbar.itemBase}
    ${collapsed ? navbar.itemCollapsed : navbar.itemExpanded}
    ${navbar.itemInactive}
  `;

  const content = (isActive = false) => (
    <>
      {isActive && <span className={navbar.activeIndicator.className} />}

      <div className={navbar.icon.wrapper}>
        <Icon
          size={navbar.icon.size}
          className={
            isActive
              ? navbar.icon.activeColor
              : navbar.icon.inactiveColor
          }
        />
      </div>

      {!collapsed && (
        <>
          <span className={navbar.label.className}>
            {route.menu.label}
          </span>

          {isExternal && (
            <ExternalLink size={14} className="ml-auto opacity-60" />
          )}
        </>
      )}
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={baseClass}
      >
        {content(false)}
      </a>
    );
  }

  return (
    <NavLink
      to={route.path}
      className={({ isActive }) =>
        `${baseClass} ${isActive ? navbar.itemActive : ""}`
      }
    >
      {({ isActive }) => content(isActive)}
    </NavLink>
  );
}