import puppeteer from "puppeteer";
import { toFileUrl } from "std/path";

// SVGElement.pauseAnimations() to stop animation
// SVGAnimationElement.setCurrentTime() to set time
// calculate time somehow using some fps and maybe duration attributes or maybe just use 5 seconds
// export each frame to png, compare each png to correct png and take average as score

/**
 *
 * @param svgPath
 * @param pngPath
 */
const svgToPng = async (svgPath, pngPath) => {
	const browser = await puppeteer.launch();

	try {
		const svgFileUrl = toFileUrl(svgPath);

		const page = (await browser.pages())[0];

		await page.goto(svgFileUrl, { waitUntil: "networkidle0" });

		await page.waitForSelector("svg");

		page.on("console", (message) => {
			console.log(message.text());
		});

		const { width, height } = await page.evaluate(() => {
			const svgElement = document.querySelector("svg");

			const viewBoxString = svgElement.getAttribute("viewBox");

			svgElement.removeAttribute("style");

			svgElement.style.width = "revert";
			svgElement.style.height = "revert";
			svgElement.removeAttribute("width");
			svgElement.removeAttribute("height");

			const [
				x,
				y,
				width,
				height
			] = viewBoxString?.split(" ") ?? [];

			if (width && height && document.querySelector("parsererror") === null) {
				return {
					width: Number(width),
					height: Number(height)
				};
			}

			throw new Error("SVG viewBox attribute is missing or malformed or SVG code is invalid");
		});

		if (width && height) {
			await page.setViewport({
				width: 4000,
				height: Math.round(height * (4000 / width))
			});

			await page.screenshot({
				path: pngPath,
				fullPage: true,
				omitBackground: true,
				captureBeyondViewport: false
			});
		}
		else {
			throw new Error("SVG viewBox attribute is missing or malformed");
		}
	}
	catch (error) {
		throw error;
	}
	finally {
		await browser.close();
	}
};

export default svgToPng;
