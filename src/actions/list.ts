import { getAllFromDb } from "../lib/db/actions";
import tablify from "../utils/tablify";
import { colors } from "../vendor/picocolors";

export default function list() {
  const drawings = getAllFromDb();

  if (drawings.length === 0) {
    console.log(colors.yellow("❔ no drawings to show. try saving first"));
    return;
  }

  console.table(tablify(drawings, "id", ["image"]));
}
