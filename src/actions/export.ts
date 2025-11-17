import { optional, parse, pipe, string, transform } from "valibot";
import { getImageSizeFromCoords, readCoords } from "../lib/wplace/coords";
import { getWplaceImage } from "../lib/wplace/image";
import nanoid from "../utils/nanoid";
import { detransparentifyPNG } from "../utils/png/detransparentify";
import upscaleImage from "../utils/png/upscale";
import writePNG from "../utils/png/write";
import { colors } from "../vendor/picocolors";

export default async function exportWplace(
  startCoordsRaw: string,
  endCoordsRaw: string,
  exportScale: number | undefined,
) {
  const startCoords = readCoords(startCoordsRaw);
  const endCoords = readCoords(endCoordsRaw);

  const image = await getWplaceImage({
    ...startCoords,
    ...getImageSizeFromCoords(startCoords, endCoords),
  });

  // TODO: add options for shouldUpscale, shouldDestransparentify, exportName
  const scale = parse(optional(pipe(string(), transform(Number))), exportScale);
  await writePNG(
    upscaleImage(detransparentifyPNG(image), scale ?? 4),
    `exports/${nanoid(10)}.png`,
  );
  console.log(colors.greenBright(`☑️ wplace image exported successfully`));
}
