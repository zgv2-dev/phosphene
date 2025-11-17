import { copy } from "copy-paste";
import { PNG } from "pngjs";
import { table } from "table";
import { optional, parse, pipe, string, transform } from "valibot";
import { getOneFromDb } from "../lib/db/actions";
import compareImages from "../lib/wplace/compare";
import { getWplaceImage } from "../lib/wplace/image";
import { detransparentifyPNG } from "../utils/png/detransparentify";
import upscaleImage from "../utils/png/upscale";
import writePNG from "../utils/png/write";
import { colors } from "../vendor/picocolors";

export default async function stats(
  id: string,
  shouldExport: boolean | undefined,
  exportScale: number | undefined,
  shouldCopy: boolean | undefined,
) {
  const drawing = getOneFromDb(id);
  const template = PNG.sync.read(Buffer.from(drawing.image));
  const wplace = await getWplaceImage(drawing);

  const compareStats = compareImages(template, wplace);
  const tableData = table(
    Object.entries(compareStats).map((entry) => [entry[0], entry[1]]),
  );
  console.log(tableData);

  if (shouldCopy) {
    copy(`${"```\n"}${tableData}${"```"}`);
    console.log(colors.greenBright(`☑️ stats copied successfully`));
  }

  // TODO: make export directory configurable.
  // TODO: pring the filepath to the exports directory (and maybe file)
  if (shouldExport) {
    const scale = parse(
      optional(pipe(string(), transform(Number))),
      exportScale,
    );
    await writePNG(
      upscaleImage(detransparentifyPNG(wplace), scale ?? 4),
      `exports/${Date.now()}-${drawing.name}`,
    );
    console.log(colors.greenBright(`☑️ wplace image exported successfully`));
  }
}
