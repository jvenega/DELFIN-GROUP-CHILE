import sharp from "sharp";
import fs from "fs";
import path from "path";

const SOURCE = path.resolve("scripts/source/LogoCuadrado.png");
const OUTPUT_DIR = path.resolve("public/icons");

const sizes = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
  { size: 64, name: "favicon-64x64.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "android-chrome-192x192.png" },
  { size: 512, name: "android-chrome-512x512.png" },
];

async function generateFavicons() {
  if (!fs.existsSync(SOURCE)) {
    throw new Error("❌ No se encontró LogoCuadrado.png en scripts/source/");
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("🔄 Generando favicons...");

  for (const item of sizes) {
    const outputPath = path.join(OUTPUT_DIR, item.name);

    await sharp(SOURCE)
      .resize(item.size, item.size, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png({ compressionLevel: 9 })
      .toFile(outputPath);

    console.log(`✔ ${item.name}`);
  }

  console.log("🎯 Favicons generados correctamente.\n");
}

generateFavicons().catch((err) => {
  console.error(err);
  process.exit(1);
});