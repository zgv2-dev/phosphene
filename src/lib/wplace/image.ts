import { PNG } from "pngjs";
import { map } from "radash";
import type { Coords, Prettify } from "../../types";
import { TILE_HEIGHT, TILE_WIDTH } from "../../utils/consts";
import { getTileUrl } from "./get-tile-url";

type WplaceCoords = Prettify<Coords & { width: number; height: number }>;

async function getWplaceTiles(drawing: WplaceCoords) {
  const xTiles = Math.ceil((drawing.pixelX + drawing.width) / TILE_WIDTH);
  const yTiles = Math.ceil((drawing.pixelY + drawing.height) / TILE_HEIGHT);

  const tilesXCoords = Array.from({ length: xTiles })
    .map((_, idx) => {
      return drawing.tileX + idx;
    })
    .sort((a, b) => a - b);
  const tilesYCoords = Array.from({ length: yTiles })
    .map((_, idx) => {
      return drawing.tileY + idx;
    })
    .sort((a, b) => a - b);

  const tilesCoords = tilesXCoords.flatMap((x) => {
    return tilesYCoords.map((y) => {
      return [x, y] as [number, number];
    });
  });

  const tiles: Buffer[][] = [];
  let row: Buffer[] = [];

  await map(tilesCoords, async ([x, y]) => {
    const url = getTileUrl(x, y);
    const buffer = Buffer.from(await (await fetch(url)).arrayBuffer());

    row.push(buffer);

    if (row.length + 1 >= xTiles) {
      tiles.push([...row]);
      row = [];
    }

    await Bun.sleep(Math.round(Math.random() * 100) + 100);
  });

  const wplaceTilesCombined = new PNG({
    width: TILE_WIDTH * xTiles,
    height: TILE_HEIGHT * yTiles,
  });

  for (let row = 0; row < yTiles; ++row) {
    for (let col = 0; col < xTiles; ++col) {
      const tileBuffer = tiles[row]![col]!;

      const tilePNG = PNG.sync.read(tileBuffer);

      for (let y = 0; y < TILE_HEIGHT; ++y) {
        const sourceStartIdx = y * TILE_WIDTH * 4;
        const destY = row * TILE_HEIGHT + y;
        const destX = col * TILE_WIDTH;
        const destStartIdx = (destY * wplaceTilesCombined.width + destX) * 4;
        tilePNG.data.copy(
          wplaceTilesCombined.data,
          destStartIdx,
          sourceStartIdx,
          sourceStartIdx + TILE_WIDTH * 4,
        );
      }
    }
  }

  return wplaceTilesCombined;
}

function cropPngImage(
  image: PNG,
  startX: number,
  startY: number,
  cropWidth: number,
  cropHeight: number,
) {
  const croppedPng = new PNG({ width: cropWidth, height: cropHeight });

  for (let y = 0; y < cropHeight; y++) {
    const sourceStartIdx = ((startY + y) * image.width + startX) * 4;
    const destStartIdx = y * cropWidth * 4;
    image.data.copy(
      croppedPng.data,
      destStartIdx,
      sourceStartIdx,
      sourceStartIdx + cropWidth * 4,
    );
  }

  return croppedPng;
}

export async function getWplaceImage(coords: WplaceCoords) {
  const wplaceTileImage = await getWplaceTiles(coords);
  const wplaceImage = cropPngImage(
    wplaceTileImage,
    coords.pixelX,
    coords.pixelY,
    coords.width,
    coords.height,
  );

  return wplaceImage;
}
