import { join } from "std/path";

import getVexillographers from "./get-vexillographers.js";

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
 * @param options.setupsFolderPath
 * @param options.staticSetupsFolderPath
 * @param options.staticDiffsFolderPath
 */
const getVexillologists = async ({
	setupsFolderPath,
	staticSetupsFolderPath,
	staticDiffsFolderPath
}) => {
	const vexillologists = {};

	const vexillologistEntries = [];

	for await (const {
		name: vexillologistName,
		isDirectory: vexillologistIsDirectory
	} of readDir(setupsFolderPath)) {
		if (vexillologistIsDirectory) {
			vexillologistEntries.push(vexillologistName);
		}
	}

	await Promise.all(vexillologistEntries.map(async (vexillologistName) => {
		const vexillologistFolderPath = join(setupsFolderPath, vexillologistName);
		const vexillologistDiffsFolderPath = join(staticDiffsFolderPath, vexillologistName);
		const detailsFilePath = join(vexillologistDiffsFolderPath, "details.json");
		let details = { score: 0 };

		try {
			details = JSON.parse(await readTextFile(detailsFilePath));
		}
		catch (error) {
			if (!(error instanceof NotFound)) {
				throw error;
			}
		}

		const vexillographers = await getVexillographers({
			vexillologistFolderPath,
			vexillologistName,
			staticSetupsFolderPath,
			vexillologistDiffsFolderPath
		});

		vexillologists[vexillologistName] = {
			details,
			vexillographers
		};
	}));

	return vexillologists;
};

export default getVexillologists;
