import { execFile } from "node:child_process";
import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const execFileAsync = promisify(execFile);

const MAX_EDGE = 1400;
const WEBP_QUALITY = 80;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ASSETS_DIR = path.join(ROOT, "assets");
const OUT_DIR = path.join(ROOT, "src", "images");
const MANIFEST_PATH = path.join(ROOT, "src", "data", "images.ts");

const ORDER = [
  "pb-aiden",
  "pb-garnie",
  "pb-matt",
  "pb-morrissey",
  "pb-nyssa",
  "pb-zachary",
  "pb-zachary-2",
  "pb-scott-1",
  "pb-scott-2",
  "pb-chris-2",
  "pb-melisa",
  "pb-osman",
  "pb-tyler",
  "pb-sanders-2",
  "pb-nikayla",
  "linc-1",
  "linc-2",
  "pb-andrea",
];

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg", ".webp", ".heic", ".heif"]);

function toIdentifier(stem: string): string {
  const name = stem.replace(/^pb-/, "").replace(/-([a-z0-9])/gi, (_, c: string) =>
    c.toUpperCase(),
  );
  return name.replace(/[^a-zA-Z0-9]/g, "");
}

function toAlt(stem: string): string {
  return stem
    .replace(/^pb-/, "")
    .split("-")
    .map((part) =>
      /^\d+$/.test(part) ? part : part.charAt(0).toUpperCase() + part.slice(1),
    )
    .join(" ");
}

function sortKey(stem: string): number {
  const index = ORDER.indexOf(stem);
  return index === -1 ? ORDER.length : index;
}

async function decodePath(inputPath: string): Promise<{ path: string; cleanup?: string }> {
  const ext = path.extname(inputPath).toLowerCase();
  if (ext !== ".heic" && ext !== ".heif") {
    return { path: inputPath };
  }

  const tmpPath = path.join(os.tmpdir(), `${path.parse(inputPath).name}-${Date.now()}.jpg`);
  await execFileAsync("sips", ["-s", "format", "jpeg", inputPath, "--out", tmpPath]);
  return { path: tmpPath, cleanup: tmpPath };
}

type OptimizedImage = {
  identifier: string;
  fileName: string;
  alt: string;
  width: number;
  height: number;
};

async function optimize(): Promise<void> {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });

  const entries = await readdir(ASSETS_DIR);
  const sources = entries
    .filter((file) => IMAGE_EXT.has(path.extname(file).toLowerCase()))
    .map((file) => ({
      file,
      stem: path.parse(file).name,
    }))
    .sort((a, b) => sortKey(a.stem) - sortKey(b.stem) || a.stem.localeCompare(b.stem));

  const optimized: OptimizedImage[] = [];

  for (const { file, stem } of sources) {
    const inputPath = path.join(ASSETS_DIR, file);
    const decoded = await decodePath(inputPath);
    try {
      const metadata = await sharp(decoded.path).metadata();
      const srcWidth = metadata.width ?? MAX_EDGE;
      const srcHeight = metadata.height ?? MAX_EDGE;
      const longest = Math.max(srcWidth, srcHeight);
      const scale = longest > MAX_EDGE ? MAX_EDGE / longest : 1;
      const width = Math.round(srcWidth * scale);
      const height = Math.round(srcHeight * scale);
      const fileName = `${stem}.webp`;
      const outPath = path.join(OUT_DIR, fileName);

      await sharp(decoded.path)
        .rotate()
        .resize(width, height, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY, effort: 6 })
        .toFile(outPath);

      optimized.push({
        identifier: toIdentifier(stem),
        fileName,
        alt: toAlt(stem),
        width,
        height,
      });

      console.log(`Wrote ${fileName} (${width}×${height})`);
    } finally {
      if (decoded.cleanup) {
        await unlink(decoded.cleanup).catch(() => undefined);
      }
    }
  }

  const imports = optimized
    .map(
      (image) =>
        `import ${image.identifier} from "../images/${image.fileName}";`,
    )
    .join("\n");

  const entriesSource = optimized
    .map(
      (image) => `  {
    src: ${image.identifier},
    width: ${image.width},
    height: ${image.height},
    ratio: ${image.width} / ${image.height},
    alt: ${JSON.stringify(image.alt)},
  }`,
    )
    .join(",\n");

  const manifest = `${imports}

export type StackImageData = {
  src: string;
  width: number;
  height: number;
  ratio: number;
  alt: string;
};

export const images: StackImageData[] = [
${entriesSource},
];
`;

  await writeFile(MANIFEST_PATH, manifest);
  console.log(`Wrote ${path.relative(ROOT, MANIFEST_PATH)}`);
}

await optimize();
