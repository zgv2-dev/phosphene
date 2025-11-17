import { PNG } from "pngjs";

export default function upscaleImage(image: PNG, scale: number): PNG {
  const upscaled = new PNG({
    width: image.width * scale,
    height: image.height * scale,
  });

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const idxOriginal = (image.width * y + x) << 2;
      const r = image.data[idxOriginal];
      const g = image.data[idxOriginal + 1];
      const b = image.data[idxOriginal + 2];
      const a = image.data[idxOriginal + 3];

      // Fill 4x4 block in upscaled image
      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const newX = x * scale + dx;
          const newY = y * scale + dy;
          const idxUpscaled = (upscaled.width * newY + newX) << 2;
          upscaled.data[idxUpscaled] = r!;
          upscaled.data[idxUpscaled + 1] = g!;
          upscaled.data[idxUpscaled + 2] = b!;
          upscaled.data[idxUpscaled + 3] = a!;
        }
      }
    }
  }

  return upscaled;
}
