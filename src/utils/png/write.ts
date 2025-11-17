import { createWriteStream } from "node:fs";
import type { PNG } from "pngjs";

export default function writePNG(image: PNG, filename: string) {
  return new Promise<void>((resolve, reject) => {
    image
      .pack()
      .pipe(createWriteStream(filename))
      .on("finish", () => {
        resolve();
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}
