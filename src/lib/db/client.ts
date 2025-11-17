import { Database } from "bun:sqlite";
import { join } from "node:path";
import xdgPaths from "../xdg-paths";

const db = new Database(join(xdgPaths.data, "./db.sqlite"), { strict: true });

export default db;
