/* eslint-env node */

import fs from "fs";
import path from "path";

const env = process.argv[2];
const version = process.argv[3];

if (!env || !version) {
  console.log("Uso: node rollback.js qa <version>");
  process.exit(1);
}

const base = path.resolve(`server/${env}`);
const releases = path.join(base, "releases");
const current = path.join(base, "current");

const target = path.join(releases, version);

if (!fs.existsSync(target)) {
  console.log("Versión no existe");
  process.exit(1);
}

// limpiar current
fs.rmSync(current, { recursive: true, force: true });

// copiar versión seleccionada
fs.cpSync(target, current, { recursive: true });

console.log(`Rollback a ${version} en ${env}`);