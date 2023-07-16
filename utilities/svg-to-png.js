import { toFileUrl } from "std/path";

import browser from "./browser.js";

const {
	Command
} = Deno;

// SVGElement.pauseAnimations() to stop animation
// SVGAnimationElement.setCurrentTime() to set time
// calculate time somehow using some fps and maybe duration attributes or maybe just use 5 seconds
// export each frame to png, compare each png to correct png and take average as score

/**
 *
 * @param svgPath
 * @param pngPath
 * @param options
 * @param options.resizeWidth
 * @param options.resizeHeight
 * @param options.compress
 */
const svgToPng = async (
	svgPath,
	pngPath,
	{
		resizeWidth = null,
		resizeHeight = null,
		compress = true
	} = {
		resizeWidth: 4000,
		resizeHeight: null,
		compress: true
	}
) => {
	const svgFileUrl = toFileUrl(svgPath);

	const page = await browser.newPage();

	await page.goto(svgFileUrl, { waitUntil: "networkidle0" });

	await page.waitForSelector("svg", { timeout: 5000 });

	page.on("console", (message) => {
		console.log(message.text());
	});

	let width;
	let height;

	try {
		({ width, height } = await page.evaluate(() => {
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
				viewBoxWidth,
				viewBoxHeight
			] = viewBoxString?.split(" ") ?? [];

			if (viewBoxWidth && viewBoxHeight && document.querySelector("parsererror") === null) {
				return {
					width: Number(viewBoxWidth),
					height: Number(viewBoxHeight)
				};
			}

			console.error("SVG viewBox attribute is missing or malformed or SVG code is invalid");
		}));
	}
	catch {
		// do nothing
	}

	if (width && height) {
		if (resizeWidth !== null && resizeHeight !== null) {
			await page.setViewport({
				width: resizeWidth,
				height: resizeHeight
			});
		}
		else if (resizeWidth && resizeHeight === null) {
			await page.setViewport({
				width: resizeWidth,
				height: Math.round(height * (resizeWidth / width))
			});
		}
		else if (resizeWidth === null && resizeHeight) {
			await page.setViewport({
				width: Math.round(width * (resizeHeight / height)),
				height: resizeHeight
			});
		}

		await page.screenshot({
			path: pngPath,
			fullPage: true,
			omitBackground: true,
			captureBeyondViewport: false
		});

		await page.close();

		if (compress) {
			const compressCommand = new Command(
				"oxipng",
				{
					args: [
						"-o",
						"6",
						"--strip",
						"safe",
						pngPath
					]
				}
			);

			await compressCommand.output();
		}
	}
	else {
		throw new Error("SVG viewBox attribute is missing or malformed");
	}
};

export default svgToPng;
