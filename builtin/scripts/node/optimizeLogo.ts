import { consola } from "consola";
import process from "node:process";
import sharp from "sharp";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

(async () => {
	const size = yargs(hideBin(process.argv)).option("size", {
		alias: "s",
		describe: "Specify the size of the logo",
		type: "number",
		demandOption: true,
	}).argv.size;

	try {
		const webpImage = "./images/logo.webp";
		const avifImage = "./images/logo.avif";
		const inputSrc = "./src/images/logo.png";

		const avifBuffer = await sharp(inputSrc)
			.avif({ quality: 60 })
			.resize(size)
			.toBuffer();
		await sharp(avifBuffer).toFile(avifImage);
		consola.success("Logo successfully optimized to Avif");

		const webpBuffer = await sharp(inputSrc)
			.webp({ quality: 75 })
			.resize(size)
			.toBuffer();
		await sharp(webpBuffer).toFile(webpImage);
		consola.success("Logo successfully optimized to Webp");
	} catch (error) {
		consola.error("Error generating favicon:", error);
	}
})();
