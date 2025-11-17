import { mkdir, stat } from "node:fs/promises";
import exitWithError from "./exit-with-error";

export default async function createExportsDirectory(): Promise<boolean> {
  try {
    const stats = await stat("exports");

    if (!stats.isDirectory()) {
      exitWithError("exports already exists and it's not a directory");
    }
    return true;
  } catch (error) {
    if ((error as ErrnoException).code === "ENOENT") {
      await mkdir("exports");
      return true;
    }
  }

  return false;
}
