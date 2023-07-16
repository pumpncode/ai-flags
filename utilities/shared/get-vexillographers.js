import { join } from "std/path";

import getVariants from "./get-variants.js";

const {
	errors: {
		NotFound
	},
	readDir,
	readTextFile
} = Deno;

/**
 *
 * @param options
 * @param options.vexillologistFolderPath
 * @param options.vexillologistName
 * @param options.staticSetupsFolderPath
 * @param options.vexillologistDiffsFolderPath
 */
const getVexillographers = async ({
	vexillologistFolderPath,
	vexillologistName,
	staticSetupsFolderPath,
	vexillologistDiffsFolderPath
}) => {
	const vexillographers = {};

	const vexillographerEntries = [];

	for await (const {
		name: vexillographerName,
		isDirectory: vexillographerIsDirectory
	} of readDir(vexillologistFolderPath)) {
		if (vexillographerIsDirectory) {
			vexillographerEntries.push(vexillographerName);
		}
	}

	await Promise.all(vexillographerEntries.map(async (vexillographerName) => {
		const vexillographerFolderPath = join(vexillologistFolderPath, vexillographerName);
		const vexillographerDiffsFolderPath = join(vexillologistDiffsFolderPath, vexillographerName);

		const detailsFilePath = join(vexillographerDiffsFolderPath, "details.json");
		let details = { score: 0 };

		try {
			details = JSON.parse(await readTextFile(detailsFilePath));
		}
		catch (error) {
			if (!(error instanceof NotFound)) {
				throw error;
			}
		}

		const variants = await getVariants({
			vexillographerFolderPath,
			vexillologistName,
			vexillographerName,
			staticSetupsFolderPath,
			vexillographerDiffsFolderPath
		});

		vexillographers[vexillographerName] = {
			details,
			variants
		};
	}));

	return vexillographers;
};

export default getVexillographers;
