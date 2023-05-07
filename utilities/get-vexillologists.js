import { join } from "std/path";

import getVexillographers from "./get-vexillographers.js";

const {
	readDir
} = Deno;

/**
 *
 * @param options
 * @param options.setupsFolderPath
 * @param options.staticSetupsFolderPath
 */
const getVexillologists = async ({
	setupsFolderPath,
	staticSetupsFolderPath
}) => {
	const vexillologists = {};

	for await (const {
		name: vexillologistName, isDirectory: vexillologistIsDirectory
	} of readDir(setupsFolderPath)) {
		if (vexillologistIsDirectory) {
			const vexillologistFolderPath = join(setupsFolderPath, vexillologistName);

			const vexillographers = await getVexillographers({
				vexillologistFolderPath,
				vexillologistName,
				staticSetupsFolderPath
			});

			vexillologists[vexillologistName] = vexillographers;
		}
	}

	return vexillologists;
};

export default getVexillologists;
