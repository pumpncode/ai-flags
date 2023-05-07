import { join } from "std/path";

import getVariants from "./get-variants.js";

const {
	readDir
} = Deno;

/**
 *
 * @param options
 * @param options.vexillologistFolderPath
 * @param options.vexillologistName
 * @param options.staticSetupsFolderPath
 */
const getVexillographers = async ({
	vexillologistFolderPath,
	vexillologistName,
	staticSetupsFolderPath
}) => {
	const vexillographers = {};

	for await (const {
		name: vexillographerName, isDirectory: vexillographerIsDirectory
	} of readDir(vexillologistFolderPath)) {
		if (vexillographerIsDirectory) {
			const vexillographerFolderPath = join(vexillologistFolderPath, vexillographerName);

			const variants = await getVariants({
				vexillographerFolderPath,
				vexillologistName,
				vexillographerName,
				staticSetupsFolderPath
			});

			vexillographers[vexillographerName] = variants;
		}
	}

	return vexillographers;
};

export default getVexillographers;
