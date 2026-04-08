/* eslint-env node */

import fs from "fs";
import path from "path";

const env = process.argv[2];

if (!env) {
  console.log("Debes indicar entorno: qa o prod");
  process.exit(1);
}

const source = path.resolve("dist");
const base = path.resolve(`server/${env}`);
const releases = path.join(base, "releases");
const current = path.join(base, "current");

// versión = timestamp
const version = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .split(".")[0];

const releasePath = path.join(releases, version);

// crear carpeta release
fs.mkdirSync(releasePath, { recursive: true });

// copiar build
fs.cpSync(source, releasePath, { recursive: true });

// 🔹 generar version.json
const versionData = {
  version,
  env,
  date: new Date().toISOString(),
};

// guardar en release
fs.writeFileSync(
  path.join(releasePath, "version.json"),
  JSON.stringify(versionData, null, 2)
);

// limpiar current
fs.rmSync(current, { recursive: true, force: true });

// copiar release a current
fs.cpSync(releasePath, current, { recursive: true });

console.log(`Deploy a ${env.toUpperCase()} OK`);
console.log(`Versión: ${version}`);