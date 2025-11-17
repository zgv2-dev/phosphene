import { colors } from "../vendor/picocolors";

export default function exitWithError(message: string): never {
  console.log(colors.bgRedBright(message));
  process.exit(1);
}
