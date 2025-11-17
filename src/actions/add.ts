import { saveToDb } from "../lib/db/actions";
import { readCoords } from "../lib/wplace/coords";
import readFile from "../utils/read-file";

// TODO: add template check for wplace colors
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
