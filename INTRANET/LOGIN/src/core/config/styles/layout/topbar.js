export const TopbarLayout = {

  height: "h-16",

  bg: "bg-white",

  border: "border-b border-[#E2E5E8]",

  container: `
  relative
  flex
  items-center
  justify-between
  px-6
  gap-6
  shadow-sm
  z-[100]
`,

  /* =========================
     BREADCRUMBS
  ========================= */

  breadcrumbs: {

    nav: "flex items-center",

    list: "flex items-center gap-2 text-sm",

    homeLink:
      "flex items-center justify-center w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition",

    homeIconSize: 16,

    separator: {
      size: 14,
      className: "text-slate-400",
    },

    link:
      "text-slate-600 hover:text-slate-900 hover:underline transition",

    active:
      "text-slate-900 font-semibold text-base px-2 py-0.5 rounded-md bg-slate-100",

  },


  /* =========================
     ACTIONS
  ========================= */

  actions: {

    container: "flex items-center gap-4",

    /* SEARCH */

    search: {

      wrapper: "relative",

      icon: {
        size: 16,
        className:
          "absolute left-3 top-1/2 -translate-y-1/2 text-slate-400",
      },

      input:
        "pl-9 pr-3 py-2 w-56 border border-[#D1D5DB] rounded-lg text-sm",

      placeholder: "Buscar… (Ctrl + K)",

    },

    /* NOTIFICATIONS */

    notifications: {

      button:
        "relative p-2 rounded-full hover:bg-slate-100",

      iconSize: 18,

      dot:
        "absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full",

    },

    /* USER */

    user: {

      button:
        "flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100",

      avatar: {

        size: "w-8 h-8",

        rounded: "rounded-full",

        border: "border",

      },

      name:
        "text-sm truncate max-w-32",

      chevronSize: 16,

    },
    menu: {

      container: `
      absolute
      right-0
      top-full
      mt-2
      w-56
      bg-white
      border
      border-[#E2E5E8]
      rounded-lg
      shadow-xl
      py-2
      z-[200]
    `,

      email:
        "px-4 py-2 text-xs text-gray-500 border-b",

      item:
        "flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 transition",

      divider:
        "my-1 h-px bg-gray-200",

      logout:
        "flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition",

    }

  }

};