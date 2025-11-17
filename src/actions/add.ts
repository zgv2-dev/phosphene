import { saveToDb } from "../lib/db/actions";
import { readCoords } from "../lib/wplace/coords";
import readFile from "../utils/read-file";

export default async function add(
  image: string,
  coords: string,
  unique = false,
) {
  const parsedCoords = readCoords(coords);
  const file = await readFile(image, unique);

  saveToDb({
    ...file,
    ...parsedCoords,
  });
}
