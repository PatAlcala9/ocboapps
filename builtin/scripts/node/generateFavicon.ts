import { consola } from "consola";
import * as fs from "node:fs";
import * as path from "node:path";
import sharp from "sharp";
import site from 'configs/site.config'

try {
	const dirPath = path.resolve("./public");

	if (fs.existsSync(dirPath)) {
		const inputSrc = "./src/images/favicon.png";
		const favicon = dirPath + "/favicon.png";
		const chrome192 = dirPath + "/android-chrome-192x192.png";
		const chrome512 = dirPath + "/android-chrome-512x512.png";
		const apple = dirPath + "/apple-touch-icon.png";
		const favicon16 = dirPath + "/favicon-16x16.png";
		const favicon32 = dirPath + "/favicon-32x32.png";

		const faviconBuffer = await sharp(inputSrc)
			.png({ quality: 90 })
			.resize(48)
			.toBuffer();
		await sharp(faviconBuffer).toFile(favicon);
		consola.success("Favicon generated successfully");

		const favicon32Buffer = await sharp(inputSrc)
			.png({ quality: 90 })
			.resize(32)
			.toBuffer();
		await sharp(favicon32Buffer).toFile(favicon32);
		consola.success("Favicon-32x32 generated successfully");

		const favicon16Buffer = await sharp(inputSrc)
			.png({ quality: 90 })
			.resize(16)
			.toBuffer();
		await sharp(favicon16Buffer).toFile(favicon16);
		consola.success("Favicon-16x16 generated successfully");

		const chrome512Buffer = await sharp(inputSrc)
			.png({ quality: 90 })
			.resize(512)
			.toBuffer();
		await sharp(chrome512Buffer).toFile(chrome512);
		const chrome192Buffer = await sharp(inputSrc)
			.png({ quality: 90 })
			.resize(192)
			.toBuffer();
		await sharp(chrome192Buffer).toFile(chrome192);
		consola.success("Android icon generated successfully");

		const appleBuffer = await sharp(inputSrc)
			.png({ quality: 90 })
			.resize(180)
			.toBuffer();
		await sharp(appleBuffer).toFile(apple);
		consola.success("iOS icon generated successfully");

		const manifestPath = path.resolve(dirPath, "site.webmanifest");
		const manifestContent = JSON.stringify(
			{
				name: site.website.name,
				short_name: site.website.short_name,
				start_url: "/",
				display: "standalone",
				background_color: "#ffffff",
				theme_color: "#000000",
				icons: [
					{
						src: "/android-chrome-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "/android-chrome-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "/apple-touch-icon.png",
						sizes: "180x180",
						type: "image/png",
					},
					{
						src: "/favicon-32x32.png",
						sizes: "32x32",
						type: "image/png",
					},
					{
						src: "/favicon-16x16.png",
						sizes: "16x16",
						type: "image/png",
					},
				],
			},
			null,
			2,
		);

		fs.writeFileSync(manifestPath, manifestContent);
		consola.success("Site Webmanifest file created successfully");
	} else {
		consola.error("Directory does not exist:", dirPath);
	}
} catch (error: any) {
	if (error.message.includes("missing")) {
		consola.error("Source favicon does not exist");
	}
}
