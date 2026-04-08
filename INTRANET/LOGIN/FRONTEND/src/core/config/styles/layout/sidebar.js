export const SidebarLayout = {

  widthExpanded: "w-64",
  widthCollapsed: "w-20",

  bgColor:
    "bg-gradient-to-b from-[#0A1220] to-[#060B17]",

  borderColor:
    "border-r border-[#1C3253]",

  header: {

    container:
      "relative flex items-center justify-center py-6 bg-white border-b border-[#E2E5E8]",

    logoFull:
      "https://www.delfingroupco.com/wp-content/uploads/2025/06/Delfin_Mayo2025.png",

    logoMini:
      "https://www.delfingroupco.com/wp-content/uploads/2025/06/LogoCuadrado.png",

    logoBase:
      "object-contain transition-all duration-300",

    logoExpanded: "w-36",

    logoCollapsed: "w-12 h-12",

    toggleButton:
      "absolute -right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-12 rounded-full bg-[#3886F5] shadow-md hover:bg-[#2C51C4] transition",

    toggleIconSize: 18,

  },


  /* NAVBAR */

  navbar: {

    container:
      "mt-6 flex flex-col gap-4",

    itemBase:
      "relative flex items-center min-h-[48px] transition",

    itemExpanded:
      "gap-4 px-6 py-3",

    itemCollapsed:
      "justify-center py-3",

    itemActive:
      "text-[#3886F5]",

    itemInactive:
      "text-[#A8ACB3] hover:text-white",

    icon: {

      wrapper:
        "flex items-center justify-center w-6 h-6",

      size: 20,

      activeColor: "text-[#3886F5]",

      inactiveColor: "text-[#A8ACB3]",

    },

    label: {

      className:
        "uppercase text-[14px] tracking-wide",

    },

    activeIndicator: {

      className:
        "absolute left-0 w-2 h-10 bg-[#3886F5] rounded-r-full",

    },

  },


  /* FOOTER */

  footer: {

    container:
      "flex items-center gap-3 px-4 py-4 border-t border-white/10",

    avatar: {
      size: "w-10 h-10",
      rounded: "rounded-full",
      border: "border border-white/20",
    },

    email:
      "text-xs text-white truncate",

    role:
      "text-[10px] text-[#3886F5] uppercase",

    guest: {
      email: "invitado@delfin.cl",
      role: "INVITADO",
    }

  }

};