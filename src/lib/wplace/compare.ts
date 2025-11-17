import type { PNG } from "pngjs";
import type { Stats } from "../../types";

export default function compareImages(template: PNG, wplace: PNG): Stats {
  const totalPixels = wplace.width * wplace.height;
  let paintedPixels = 0;
  let correctPixels = 0;

  for (let y = 0; y < wplace.height; y++) {
    for (let x = 0; x < wplace.width; x++) {
      const idx = (wplace.width * y + x) << 2;

      const isRedSame = wplace.data[idx] === template.data[idx];
      const isGreenSame = wplace.data[idx + 1] === template.data[idx + 1];
      const isBlueSame = wplace.data[idx + 2] === template.data[idx + 2];
      const isAlphaSame = wplace.data[idx + 3] === template.data[idx + 3];
      const isPaintedPixel = wplace.data[idx + 3] !== 0;

      if (isRedSame && isGreenSame && isBlueSame && isAlphaSame) {
        correctPixels += 1;
      }
      if (isPaintedPixel) {
        paintedPixels += 1;
      }
    }
  }

  const percentageComplete =
    Math.round((correctPixels / totalPixels) * 100000) / 1000;

  return {
    totalPixels,
    paintedPixels,
    correctPixels,
    percentageComplete,
  };
}
