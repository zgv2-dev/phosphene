#!/usr/bin/env bun

import { Command } from "commander";
import pkg from "../package.json";
import add from "./actions/add";
import exportWplace from "./actions/export";
import list from "./actions/list";
import remove from "./actions/remove";
import stats from "./actions/stats";
import toggle from "./actions/toggle";
import { db } from "./lib/db";
import { prepareDb } from "./lib/db/actions";
import createExportsDirectory from "./utils/create-exports-dir";
import exitWithError from "./utils/exit-with-error";
import { colors } from "./vendor/picocolors";

const program = new Command();

program
  .name("phosphene")
  .description("a cli tool to track wplace progress")
  .usage("<command> [options]")
  .version(pkg.version)
  .hook("preSubcommand", () => {
    prepareDb();
  });

program
  .command("add <image> <coords>")
  .option("-u, --unique", "make the name unique")
  .hook("preAction", () => {
    prepareDb();
  })
  .description(
    'save drawing to tracking db\ncoords can be copied from wplace "(Tl X: 1195, Tl Y: 693, Px X: 839, Px Y: 595)"\nor provided in TileX TileY PixelX PixelY format "1195 693 839 595"',
  )
  .usage(
    `${colors.yellow("/path/to/png-image.png")} ${colors.green('"(Tl X: 1195, Tl Y: 693, Px X: 839, Px Y: 595)"')}`,
  )
  .action(async (image, coords, opts) => {
    await add(image, coords, opts.unique);
  });
program
  .command("remove <id>")
  .description("remove drawing from tracking")
  .action(remove);
program.command("list").description("list saved drawings").action(list);
program
  .command("stats <id>")
  .option("-c, --copy", "copy stats to the clipboard")
  .option("-e, --export", "export wplace image")
  .option("--scale <number>", "wplace image export upscale")
  .description("view current state of a drawing")
  .hook("preAction", async () => {
    const result = await createExportsDirectory();

    if (!result) {
      exitWithError("couldn't create exports directory");
    }
  })
  .action(
    async (id, opts) => await stats(id, opts.export, opts.scale, opts.copy),
  );
program
  .command("toggle <id>")
  .description("enable/disable auto tracking of drawing")
  .action(toggle);
program
  .command("export <start> <end>")
  .option("--scale <number>", "wplace image export upscale")
  .description("export wplace image")
  .action(async (startCoords, endCoords, opts) => {
    await exportWplace(startCoords, endCoords, opts.scale);
  });

try {
  await program.parseAsync();
} catch (error) {
  exitWithError((error as Error).message);
}

if (process.argv.length < 3) {
  program.help();
}

db.close();
