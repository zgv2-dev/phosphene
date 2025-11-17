import type { PNG } from "pngjs";
import type { Color, Stats } from "../../types";
import exitWithError from "../../utils/exit-with-error";
import rgbaToHex from "../../utils/png/rgba-to-hex";

const wplaceColors = (await Bun.file("colors.json").json()) as Color[];
const wplaceColorsMap = wplaceColors.reduce(
  (acc, color) => {
    const colorHex = rgbaToHex(
      color.color.r,
      color.color.g,
      color.color.b,
      color.color.a,
    );
    acc[colorHex] = color;

    return acc;
  },
  {} as Record<string, Color>,
);

export default function compareImages(
  template: PNG,
  wplace: PNG,
  detailed: boolean | undefined,
): Stats {
  const totalPixels = wplace.width * wplace.height;
  let paintedPixels = 0;
  let correctPixels = 0;
  const totalTemplateColors: Record<string, number> = {};
  const pixelsPerColor: Record<string, { correct: number; incorrect: number }> =
    {};

  for (let y = 0; y < wplace.height; y++) {
    for (let x = 0; x < wplace.width; x++) {
      const idx = (wplace.width * y + x) << 2;

      if (template.data[idx + 3] === 0) continue;

      const templateHex = rgbaToHex(
        template.data[idx]!,
        template.data[idx + 1]!,
        template.data[idx + 2]!,
        template.data[idx + 3]!,
      );
      totalTemplateColors[templateHex] =
        (totalTemplateColors[templateHex] ?? 0) + 1;

      const wplaceHex = rgbaToHex(
        wplace.data[idx]!,
        wplace.data[idx + 1]!,
        wplace.data[idx + 2]!,
        wplace.data[idx + 3]!,
      );

      const isPixelPainted = wplace.data[idx + 3] === 255;
      const isPixelCorrect = wplaceHex === templateHex;

      if (isPixelPainted) {
        paintedPixels += 1;
      }
      if (isPixelCorrect) {
        correctPixels += 1;
      }
      if (detailed) {
        const color = wplaceColorsMap[templateHex];
        const colorName = color?.name ?? wplaceHex ?? "Unknown";

        const previousValue = pixelsPerColor[colorName] ?? {
          correct: 0,
          incorrect: 0,
        };

        pixelsPerColor[colorName] = {
          ...previousValue,
          ...(isPixelCorrect
            ? {
                correct: previousValue.correct + 1,
              }
            : isPixelPainted
              ? {
                  incorrect: previousValue.incorrect + 1,
                }
              : {}),
        };
      }
    }
  }

  const percentageComplete =
    Math.round((correctPixels / totalPixels) * 100000) / 1000;

  const colorsStats: Stats["colorsStats"] = {};

  for (const color in wplaceColorsMap) {
    const colorName = wplaceColorsMap[color]?.name;
    if (!colorName) {
      exitWithError("colors json is broken");
    }

    if (!totalTemplateColors[color]) continue;

    const colorStats = pixelsPerColor[colorName]!;

    colorsStats[colorName] = {
      total: totalTemplateColors[color]!,
      correct: colorStats.correct,
      incorrect: colorStats.incorrect,
      percentageComplete:
        Math.round((colorStats.correct / totalTemplateColors[color]!) * 10000) /
        100,
    };
  }

  return {
    totalPixels,
    paintedPixels,
    correctPixels,
    percentageComplete,
    ...(detailed ? { colorsStats } : {}),
  };
}
