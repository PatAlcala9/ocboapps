import { consola } from "consola";
import process from "node:process";
import sharp from "sharp";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

(async () => {
  const argv = yargs(hideBin(process.argv))
    .option("name", {
      alias: "n",
      describe: "Specify the name of the image",
      type: "string",
      demandOption: true,
    })
    .option("size", {
      alias: "s",
      describe: "Specify the size of the image",
      type: "number",
      demandOption: true,
    }).argv;

  const name = argv.name;
  const size = argv.size;

  try {
    // const avifOutputPath = `./images/${name.toString().split(".").slice(0, -1).join(".")}.avif`;
    // const webpOutputPath = `./images/${name.toString().split(".").slice(0, -1).join(".")}.webp`;
    
    const avifOutputPath = `./images/${name}.avif`;
    const webpOutputPath = `./images/${name}.webp`;

    const avifBuffer = await sharp(`./src/images/${name}.png`)
      .avif({ quality: 60 })
      .resize(size)
      .toBuffer();
    await sharp(avifBuffer).toFile(avifOutputPath);
    consola.success(`${name} successfully optimized to Avif`);

    const webpBuffer = await sharp(`./src/images/${name}.png`)
      .webp({ quality: 75 })
      .resize(size)
      .toBuffer();
    await sharp(webpBuffer).toFile(webpOutputPath);
    consola.success(`${name} successfully optimized to Webp`);
  } catch (error: any) {
    consola.error("Error optimizing image:", error);
    if (error.message.includes("missing"))
      consola.error(`${name} could not be found on image folder`);
  }
})();
