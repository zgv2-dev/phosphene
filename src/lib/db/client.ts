import { Database } from "bun:sqlite";

const db = new Database("./db.sqlite", { strict: true });

export default db;
