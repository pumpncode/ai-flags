import { join, dirname } from "std/path";

import { getDbFlags } from "@/utilities/local.js";
import browser from "@/utilities/browser.js";

const {
	Command,
	cwd,
	errors: {
		NotFound
	},
	mkdir,
	stat
} = Deno;

const flags = await getDbFlags();

const page = await browser.newPage();

const printWidth = 3050;
const printHeight = 4060;

await page.setViewport({
	width: printWidth,
	height: printHeight
});

for (const {
	code,
	instance: {
		name: instanceName,
		variant: {
			name: variantName,
			vexillographer: {
				name: vexillographerName,
				vexillologist:
				{
					name: vexillologistName
				}
			}
		}
	}
} of flags) {
	const fullNameArray = [
		vexillologistName,
		vexillographerName,
		variantName,
		instanceName,
		code
	];
	const fullName = fullNameArray.join("/");

	const pngPath = join(cwd(), "print", `${fullName}.png`);

	let alreadyProcessed = false;

	try {
		await stat(pngPath);

		alreadyProcessed = true;
	}
	catch (error) {
		if (!(error instanceof NotFound)) {
			throw error;
		}
	}

	if (!alreadyProcessed || alreadyProcessed) {
		console.info(fullName);

		const url = `http://localhost:8000/print/${fullName}`;

		await page.goto(url, { waitUntil: "load" });

		await mkdir(dirname(pngPath), { recursive: true });

		await page.screenshot({
			path: pngPath,
			fullPage: true,
			omitBackground: true,
			captureBeyondViewport: false
		})
			.catch((error) => {
				console.error(error);
			});

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

await page.close();

await browser.close();
