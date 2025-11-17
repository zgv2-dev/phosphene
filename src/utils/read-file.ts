import { basename } from "node:path";
import { nanoid } from "nanoid";
import { PNG } from "pngjs";
import type { File } from "../types";
import { getFileName } from "./get-file-name";

export default async function readFile(
  filePath: string,
  unique: boolean | undefined,
): Promise<File> {
  const file = Bun.file(filePath);

  if (!(await file.exists())) {
    throw new Error("file path is incorrect. try again");
  }

  if (file.type !== "image/png") {
    throw new Error("only png images are currently supported");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const pngImage = PNG.sync.read(buffer);

  return {
    image: buffer,
    name: getFileName(basename(file.name ?? `${nanoid()}.png`), unique),
    width: pngImage.width,
    height: pngImage.height,
  };
}
