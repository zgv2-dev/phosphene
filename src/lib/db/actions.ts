import { copy } from "copy-paste";
import { type Drawing, DrawingDTO, type Prettify } from "../../types";
import exitWithError from "../../utils/exit-with-error";
import nanoid from "../../utils/nanoid";
import { colors } from "../../vendor/picocolors";
import db from "./client";

export function prepareDb() {
  db.query(
    `create table if not exists drawings (
      id text non null primary key,
      name text not null unique,
      image blob not null,
      width integer not null,
      height integer not null,
      tileX integer not null,
      tileY integer not null,
      pixelX integer not null,
      pixelY integer not null
    );`,
  ).run();
}

export function saveToDb(drawing: Prettify<Omit<Drawing, "id">>) {
  const query = db
    .query(
      "insert into drawings (id, name, image, width, height, tileX, tileY, pixelX, pixelY) values ($id, $name, $image, $width, $height, $tileX, $tileY, $pixelX, $pixelY) returning id;",
    )
    .as(DrawingDTO);

  try {
    const savedDrawing = query.get({
      id: nanoid(6),
      ...drawing,
    });

    if (savedDrawing?.id) {
      copy(`phosphene stats ${savedDrawing.id}`);
      console.log(
        colors.greenBright(
          `☑️ successfully saved. run ${colors.inverse(`phosphene stats ${savedDrawing.id}`)} to see progress status (copied to the clipboard)`,
        ),
      );
    } else {
      console.log(colors.redBright("✖️ something isn't correct"));
    }
  } catch (error) {
    exitWithError((error as Error).message);
  }
}

export function removeFromDb(id: string) {
  const query = db.query("delete from drawings where id = $id;");

  try {
    const result = query.run({ id });

    if (result.changes === 1) {
      console.log(colors.greenBright("☑️ successfully removed"));
    } else {
      console.log(colors.redBright("✖️ you sure it's the correct id?"));
    }
  } catch (error) {
    exitWithError((error as Error).message);
  }
}

export function getAllFromDb(): Drawing[] {
  const query = db.query("select * from drawings;").as(DrawingDTO);

  try {
    return query.all();
  } catch (error) {
    exitWithError((error as Error).message);
  }
}

export function getOneFromDb(id: string) {
  const query = db
    .query("select * from drawings where id = $id;")
    .as(DrawingDTO);

  try {
    const drawing = query.get({ id });

    return drawing ?? exitWithError(`drawing with id ${id} wasn't found`);
  } catch (error) {
    exitWithError((error as Error).message);
  }
}
