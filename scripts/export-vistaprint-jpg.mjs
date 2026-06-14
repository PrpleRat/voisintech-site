import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..", "..");
const printDir = path.join(rootDir, "Output", "print");
const outDir = path.join(printDir, "jpg");

const BASE_DPI = 300;
const MM_TO_PX = BASE_DPI / 25.4;

function mmToPx(mm) {
  return Math.round(mm * MM_TO_PX);
}

const exports = [
  {
    name: "voisintech-carte-visite-recto",
    html: "voisintech-carte-visite-recto.html",
    widthMm: 91,
    heightMm: 61,
    scaleFactor: 4,
    selector: ".card",
  },
  {
    name: "voisintech-carte-visite-verso",
    html: "voisintech-carte-visite-verso.html",
    widthMm: 91,
    heightMm: 61,
    scaleFactor: 4,
    selector: ".card",
  },
  {
    name: "voisintech-flyer-a5",
    html: "voisintech-flyer-vistaprint.html",
    widthMm: 154,
    heightMm: 216,
    scaleFactor: 2,
    selector: ".canvas",
  },
];

async function exportJpg({ chromium }) {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });

  for (const item of exports) {
    const htmlPath = path.join(printDir, item.html);
    if (!fs.existsSync(htmlPath)) {
      console.error("Manquant:", htmlPath);
      process.exit(1);
    }

    const width = mmToPx(item.widthMm);
    const height = mmToPx(item.heightMm);
    const outPath = path.join(outDir, `${item.name}.jpg`);
    const effectiveDpi = Math.round(BASE_DPI * item.scaleFactor);

    const context = await browser.newContext({
      deviceScaleFactor: item.scaleFactor,
    });
    const page = await context.newPage();
    await page.setViewportSize({ width, height });
    await page.goto(`file:///${htmlPath.replace(/\\/g, "/")}`, {
      waitUntil: "networkidle",
      timeout: 60_000,
    });
    await page.waitForTimeout(2000);

    const el = await page.$(item.selector);
    if (!el) {
      console.error("Sélecteur introuvable:", item.selector, item.html);
      process.exit(1);
    }

    await el.screenshot({
      path: outPath,
      type: "jpeg",
      quality: 98,
    });

    await context.close();

    const stat = fs.statSync(outPath);
    console.log(
      `OK ${item.name}.jpg — ${width * item.scaleFactor}×${height * item.scaleFactor}px (~${effectiveDpi} DPI)`
    );
    console.log(`   ${Math.round(stat.size / 1024)} Ko`);
  }

  await browser.close();
  console.log("\nFichiers dans:", outDir);
}

async function main() {
  const { chromium } = await import("playwright");
  await exportJpg({ chromium });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
