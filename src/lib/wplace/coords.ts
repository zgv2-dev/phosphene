import { parse, string } from "valibot";
import { type Coords, coordsSchema } from "../../types";
import { TILE_HEIGHT, TILE_WIDTH } from "../../utils/consts";
import exitWithError from "../../utils/exit-with-error";

const copiedCoordsPattern = new RegExp(
  /\(Tl X: (?<tileX>\d+), Tl Y: (?<tileY>\d+), Px X: (?<pixelX>\d+), Px Y: (?<pixelY>\d+)\)/i,
);
const justNumbersCoordsPattern = new RegExp(
  /^(?<tileX>\d+)\s+(?<tileY>\d+)\s+(?<pixelX>\d+)\s+(?<pixelY>\d+)$/,
);

const tryParseCoords = (
  unparsedCoordsString: string,
  pattern: RegExp,
): Coords | undefined => {
  const matchedCoords = unparsedCoordsString.match(pattern);
  if (matchedCoords?.groups) {
    const coords = parse(coordsSchema, matchedCoords.groups);
    return coords;
  }
};

export function readCoords(rawCoordsLine: string): Coords {
  const coordsString = parse(string(), rawCoordsLine);
  const coords =
    tryParseCoords(coordsString, justNumbersCoordsPattern) ??
    tryParseCoords(coordsString, copiedCoordsPattern) ??
    exitWithError(
      'Copy and paste coords from wplace or type them out in <Tile X> <Till Y> <Pixel X> <Pixel Y> format.\nMake sure you\'re using quotes for coords like so "(Tl X: 1195, Tl Y: 694, Px X: 302, Px Y: 369)"',
    );

  return coords;
}

export function getImageSizeFromCoords(startCoords: Coords, endCoords: Coords) {
  const xTiles = (endCoords.tileX - startCoords.tileX) * TILE_WIDTH;
  const yTiles = (endCoords.tileY - startCoords.tileY) * TILE_HEIGHT;

  const width = endCoords.pixelX - startCoords.pixelX + xTiles + 1;
  const height = endCoords.pixelY - startCoords.pixelY + yTiles + 1;

  return { width, height };
}
