import { dirname, fromFileUrl, join } from "std/path";

const {
	errors: {
		NotFound
	},
	readDir,
	readTextFile
} = Deno;

const setupPatches = new Map();

const patchesFolderPath = join(dirname(fromFileUrl(import.meta.url)), "patches");

for await (const { name: code, isDirectory } of readDir(patchesFolderPath)) {
	if (isDirectory) {
		const descriptionFilePath = join(patchesFolderPath, code, "description.md");

		try {
			const description = await readTextFile(descriptionFilePath);

			setupPatches.set(code, new Map([["description", description]]));
		}
		catch (error) {
			if (!(error instanceof NotFound)) {
				throw error;
			}
		}

		const svgFilePath = join(patchesFolderPath, code, "flag.svg");

		try {
			const svg = await readTextFile(svgFilePath);

			if (setupPatches.has(code)) {
				setupPatches.get(code).set("svg", svg);
			}
			else {
				setupPatches.set(code, new Map([["svg", svg]]));
			}
		}
		catch (error) {
			if (!(error instanceof NotFound)) {
				throw error;
			}
		}
	}
}

export default setupPatches;