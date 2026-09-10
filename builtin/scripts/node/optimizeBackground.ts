import { consola } from "consola";
import sharp from "sharp";

(async () => {
	try {
    const inputSrc = 'src/images/background.png'
    const webpOutput = "./@dasig/images/background.webp"
    const avifOutput = "./@dasig/images/background.avif"

    const avifBuffer = await sharp(inputSrc).avif({ quality: 60 }).resize(1920).toBuffer()
    await sharp(avifBuffer).toFile(avifOutput)
    consola.success('Background successfully optimized to Avif');

    const webpBuffer = await sharp(inputSrc).webp({ quality: 75 }).resize(1920).toBuffer()
    await sharp(webpBuffer).toFile(webpOutput)
    consola.success('Background successfully optimized to Webp');

	} catch (error: any) {
		consola.error("Error optimizing background:", error);
		if (error.message.includes("missing"))
			consola.error(`${name} could not be found on image folder`);
	}
})();
