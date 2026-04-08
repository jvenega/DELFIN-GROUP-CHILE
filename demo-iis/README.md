# 🚀 Demo CI/CD con React + Vite + Simulación IIS

Este proyecto demuestra un flujo completo de **CI/CD**, incluyendo:

-   Separación de entornos (QA / PROD)
-   Versionado de despliegues
-   Sistema de releases
-   Rollback funcional
-   Simulación de servidores IIS en entorno local

---

# 📦 Tecnologías

-   React + Vite
-   Node.js
-   Scripts personalizados (deploy / rollback)

---

# 🧱 Estructura del proyecto

project/  
├── src/  
├── scripts/  
│ ├── deploy.js  
│ └── rollback.js  
├── server/  
│ ├── qa/  
│ │ ├── releases/  
│ │ └── current/  
│ └── prod/  
│ ├── releases/  
│ └── current/  
├── .env.qa  
├── .env.production  
├── package.json

---

# ⚙️ Configuración de entornos

.env.qa  
VITE\_ENV=QA

.env.production  
VITE\_ENV=PROD

---

# 🛠️ Scripts disponibles

npm run dev  
npm run build

npm run build:qa  
npm run build:prod

npm run deploy:qa  
npm run deploy:prod

npm run rollback:qa  
npm run rollback:prod

---

# 🚀 Flujo de despliegue

## Deploy QA

npm run deploy:qa

Esto:

1.  Genera build (dist/)
2.  Crea nueva versión en server/qa/releases/
3.  Copia a server/qa/current
4.  Genera version.json

---

## Deploy PROD

npm run deploy:prod

---

# 🧾 version.json

{  
“version”: “20260408153000”,  
“env”: “qa”,  
“date”: “2026-04-08T15:30:00.000Z”  
}

---

# 🔄 Rollback

node scripts/rollback.js qa

---

# 🌐 Simulación de servidor

npx serve server/qa/current  
npx serve server/prod/current

---

# 🧠 Conceptos implementados

-   current = versión activa
-   releases = historial
-   rollback funcional

---

# 🔁 Flujo Git recomendado

feature/\* → develop → QA  
develop → main → PROD

---

# 🎯 Objetivo

Simular un entorno real de despliegue empresarial con versionado y rollback.

---

# 👨‍💻 Autor

Delfin Group Chile