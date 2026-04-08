/**
 * ==========================================================
 * LoginConfig
 * ----------------------------------------------------------
 * Autor: Juan Venegas
 * Fecha: 2026-01-16
 *
 * Propósito:
 * Centraliza TODA la configuración visual y textual
 * del módulo de autenticación (Login / Recover).
 *
 * ❗ Reglas:
 * - NO contiene lógica
 * - NO contiene hooks
 * - NO depende de React
 * - SOLO estilos, textos, assets y límites
 *
 * Estructura esperada:
 * LoginConfig.auth.login.*
 *
 * ==========================================================
 */

export const LoginConfig = {
    auth: {
        login: {
            /* ======================================================
               Layout general de la página
            ====================================================== */
            layout: {
                container:
                    "relative min-h-screen w-full overflow-hidden text-white",

                background:
                    "absolute inset-0 bg-cover bg-center",

                overlay:
                    "absolute inset-0 bg-gradient-to-r from-[#1C3253]/95 via-[#1C3253]/85 via-[40%] to-transparent",

                contentWrapper:
                    "relative z-10 min-h-screen flex items-center",

                panel:
                    "w-full max-w-[520px] pl-[8vw]",
            },

            /* ======================================================
               Header login
            ====================================================== */
            header: {
                logoWrapper:
                    "w-32 h-32 rounded-full bg-[#1f1f1f] flex items-center justify-center mb-4",

                logo:
                    "w-28 h-28 rounded-full object-contain",

                title:
                    "text-2xl text-center",

                subtitle:
                    "text-sm text-white/60 mt-2 text-center",
            },

            /* ======================================================
               Header recuperación
            ====================================================== */
            recoverHeader: {
                iconWrapper:
                    "w-24 h-24 rounded-full bg-blue-600/20 flex items-center justify-center mb-4",

                title:
                    "text-xl font-medium",

                subtitle:
                    "text-sm text-white/60 mt-2 text-center",
            },

            /* ======================================================
               Footer
            ====================================================== */
            footer:
                "text-[12px] text-white/40 text-center mt-10",

            /* ======================================================
               Assets
            ====================================================== */
            assets: {
                logo:
                    "https://www.delfingroupco.com/wp-content/uploads/2025/06/LogoCuadrado.png",

                backgroundImage: "portadaDelfin", // referencia lógica
            },

            /* ======================================================
               Textos
            ====================================================== */
            texts: {
                title:
                    "Delfín Group Chile Intranet",

                subtitle:
                    "Inicie sesión con su cuenta corporativa",

                recoverTitle:
                    "Recuperar acceso",

                recoverSubtitle:
                    "Solicita un código de recuperación",

                footer:
                    "Delfín Group Chile · Departamento de Informática",
            },

            /* ======================================================
               Animaciones
            ====================================================== */
            animation: {
                durationMs: 600,
            },

            /* ======================================================
               Mensajes de error backend
            ====================================================== */
            errors: {
                INVALID_CREDENTIALS:
                    "Usuario o contraseña incorrectos",

                USUARIO_BLOQUEADO:
                    "Usuario bloqueado por seguridad",

                USUARIO_INACTIVO:
                    "Usuario deshabilitado. Contacte a TI",

                DEFAULT:
                    "No fue posible realizar la operación",
            },

            /* ======================================================
               FORMULARIO LOGIN
            ====================================================== */
            form: {
                /* Inputs */
                inputBase:
                    "w-full pl-12 py-3 bg-transparent border rounded-lg text-sm text-white placeholder-white/50 outline-none transition",

                inputPassword:
                    "w-full pl-12 pr-12 py-3 bg-transparent border rounded-lg text-sm text-white placeholder-white/50 outline-none transition",

                inputIcon:
                    "absolute left-4 top-3.5 text-blue-500",

                togglePassword:
                    "absolute right-4 top-3 text-blue-500",

                /* Estados */
                error:
                    "flex gap-2 text-xs text-red-300",

                /* Botón submit */
                submit:
                    "w-full mt-4 py-3 rounded-full font-medium flex items-center justify-center gap-2 transition",

                submitEnabled:
                    "bg-blue-500 hover:bg-blue-600",

                submitDisabled:
                    "bg-blue-400 cursor-not-allowed",

                /* Recuperar contraseña */
                recover:
                    "text-sm text-center text-blue-400 hover:text-blue-300 mt-4 cursor-pointer aling-items-center flex justify-center gap-1 ",

                /* Textos del formulario */
                messages: {
                    invalidRut:
                        "RUT inválido. Use formato sin puntos y con guion.",

                    invalidEmail:
                        "Correo electrónico inválido.",

                    invalidPassword:
                        "La contraseña no puede superar los 8 caracteres",

                    userPlaceholder:
                        "Rut o usuario@delfingroup.cl",

                    passwordPlaceholder:
                        "Contraseña (máx. 8 caracteres)",

                    submit:
                        "Ingresar",

                    loading:
                        "Verificando…",
                },

                /* Reglas */
                maxPasswordLength: 8,
            },
            /* ======================================================
               FORMULARIO RECUPERAR CONTRASEÑA
            ====================================================== */
            recoverForm: {
                input:
                    "w-full pl-12 pr-4 py-3 bg-transparent text-white text-sm placeholder-white/50 border border-white/20 rounded-lg outline-none focus:border-blue-500 transition",

                icon:
                    "absolute left-4 top-3.5 text-blue-500",

                submit:
                    "w-full py-3 rounded-full font-medium flex items-center justify-center gap-2 transition",

                submitEnabled:
                    "bg-blue-500 hover:bg-blue-600",

                submitDisabled:
                    "bg-blue-400/60 cursor-not-allowed",

                back:
                    "text-sm text-center text-blue-400 hover:text-blue-300 cursor-pointer",

                messages: {
                    placeholder:
                        "Correo Corporativo o Rut",
                    submit:
                        "Solicitar código de recuperación",
                    loading:
                        "Enviando…",
                    back:
                        "← Volver al inicio",
                },
            },

            // eslint-disable-next-line no-dupe-keys
            animation: {
                easeSmooth: [0.22, 1, 0.36, 1], // easeOutCubic
                duration: {
                    page: 0.45,
                    header: 0.35,
                    exit: 0.25,
                    form: 0.35,
                    panel: 0.6,
                },

                variants: {
                    page: {
                        hidden: { opacity: 0 },
                        visible: (d) => ({
                            opacity: 1,
                            transition: {
                                duration: d.page,
                                ease: d.ease,
                            },
                        }),
                    },

                    header: {
                        hidden: { opacity: 0, y: -6 },
                        visible: (d) => ({
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: d.header,
                                ease: d.ease,
                            },
                        }),
                        exit: (d) => ({
                            opacity: 0,
                            y: -6,
                            transition: {
                                duration: d.exit,
                                ease: d.ease,
                            },
                        }),
                    },

                    form: {
                        hidden: { opacity: 0, y: 10 },
                        visible: (d) => ({
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: d.form,
                                ease: d.ease,
                            },
                        }),
                        exit: (d) => ({
                            opacity: 0,
                            y: -10,
                            transition: {
                                duration: d.exit,
                                ease: d.ease,
                            },
                        }),
                    },

                    rightPanel: {
                        hidden: { opacity: 0, x: 24 },
                        visible: (d) => ({
                            opacity: 1,
                            x: 0,
                            transition: {
                                duration: d.panel,
                                ease: d.ease,
                            },
                        }),
                    },
                },
            },
        },
    },
};
