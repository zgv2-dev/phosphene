import { removeFromDb } from "../lib/db/actions";

export default async function remove(id: string) {
  removeFromDb(id);
}
