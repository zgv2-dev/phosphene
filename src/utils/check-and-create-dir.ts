import { mkdir, stat } from "node:fs/promises";
import exitWithError from "./exit-with-error";

export default async function checkAndCreateDirectory(
  dirname: string,
): Promise<boolean> {
  try {
    const stats = await stat(dirname);

    if (!stats.isDirectory()) {
      exitWithError(`${dirname} already exists and it's not a directory`);
    }
    return true;
  } catch (error) {
    if ((error as ErrnoException).code === "ENOENT") {
      await mkdir(dirname);
      return true;
    }
  }

  return false;
}
