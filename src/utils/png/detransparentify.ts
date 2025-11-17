import { PNG } from "pngjs";

export function detransparentifyPNG(image: PNG) {
  const detransparentedImage = new PNG({
    width: image.width,
    height: image.height,
    colorType: 2,
  });

  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const idx = (image.width * y + x) << 2;

      detransparentedImage.data[idx] = image.data[idx]!;
      detransparentedImage.data[idx + 1] = image.data[idx + 1]!;
      detransparentedImage.data[idx + 2] = image.data[idx + 2]!;
      detransparentedImage.data[idx + 3] = image.data[idx + 3]!;

      if (image.data[idx + 3] === 0) {
        detransparentedImage.data[idx] = 255;
        detransparentedImage.data[idx + 1] = 255;
        detransparentedImage.data[idx + 2] = 255;
        detransparentedImage.data[idx + 3] = 255;
      }
    }
  }

  return detransparentedImage;
}
