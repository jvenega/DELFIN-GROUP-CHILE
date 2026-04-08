import { writeFileSync } from "fs";

// ==============================
// CONFIG
// ==============================
const TOTAL = 1000; // cantidad de registros a generar

const estados = [
  { id: 1, glosa: "Disponible" },
  { id: 2, glosa: "Asignado" },
  { id: 3, glosa: "Retiro" },
  { id: 4, glosa: "Reparacion" },
  { id: 5, glosa: "Baja" },
];

const sucursales = [
  { id: 1, nombre: "SANTIAGO" },
  { id: 2, nombre: "IQUIQUE" },
  { id: 3, nombre: "ANTOFAGASTA" },
  { id: 4, nombre: "VALPARAISO" },
  { id: 5, nombre: "BODEGA_SCL" },
];

const personas = [
  { rut: "12345678-9", nombre: "Juan Venegas" },
  { rut: "98765432-1", nombre: "María López" },
  { rut: "11111111-1", nombre: "Pedro Soto" },
  { rut: "22222222-2", nombre: "Ana Díaz" },
  { rut: null, nombre: null },
];

const responsables = ["TI", "Soporte TI", "Mesa Ayuda"];

const observaciones = [
  "Entrega inicial de equipo",
  "Falla de batería",
  "Cambio de usuario",
  "Mantención preventiva",
  "Equipo obsoleto",
  "Equipo reparado",
];

// ==============================
// HELPERS
// ==============================
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(start, end) {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString();
}

function randomSerie() {
  const num = Math.floor(Math.random() * 999)
    .toString()
    .padStart(3, "0");
  const letters = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `NB-${num}-${letters}`;
}

// ==============================
// GENERADOR
// ==============================
const data = [];

for (let i = 1; i <= TOTAL; i++) {
  const estado = randomItem(estados);
  const sucursal = randomItem(sucursales);
  const persona = randomItem(personas);

  const fecha = randomDate(
    new Date(2025, 0, 1),
    new Date(2026, 2, 31)
  );

  data.push({
    ID_Movimiento: i,
    Fecha_movimiento: fecha,
    ID_Estado: estado.id,
    Glosa_Estado: estado.glosa,
    Fecha_Asignado: estado.id === 2 ? fecha : null,
    Rut_Persona: persona.rut,
    Nombre_Persona: persona.nombre,
    ID_Sucursal: sucursal.id,
    Nombre_Sucursal: sucursal.nombre,
    Serie: randomSerie(),
    Responsable: randomItem(responsables),
    Observacion: randomItem(observaciones),
  });
}

// ==============================
// EXPORT
// ==============================
const output = `export const mockMovimientos = ${JSON.stringify(
  data,
  null,
  2
)};\n`;

writeFileSync("mockMovimientos.js", output);

console.log(`Mock generado con ${TOTAL} registros`);