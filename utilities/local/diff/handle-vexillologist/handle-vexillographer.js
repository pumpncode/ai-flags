import { join } from "std/path";

import handleSetup from "./handle-vexillographer/handle-setup.js";
import getAverageScore from "./get-average-score.js";

import getDirectories from "@/utilities/local/get-directories.js";

const {
	mkdir,
	writeTextFile
} = Deno;

/**
 *
 * @param vexillographer
 * @param vexillologistFolderPath
 * @param vexillologistDiffsFolderPath
 * @param vexillographer.vexillographerFolderPath
 * @param vexillographer.vexillographerDiffsFolderPath
 */
const handleVexillographer = async ({
	vexillographerFolderPath,
	vexillographerDiffsFolderPath
}) => {
	await mkdir(vexillographerDiffsFolderPath, { recursive: true });

	const vexillographerDetails = {};

	const setups = await getDirectories(vexillographerFolderPath);
	const setupDetailsArray = await Promise.all(setups.map((setup) => {
		const setupFolderPath = join(vexillographerFolderPath, setup);
		const setupDiffsFolderPath = join(vexillographerDiffsFolderPath, setup);

		return handleSetup({
			setupFolderPath,
			setupDiffsFolderPath
		});
	}));

	vexillographerDetails.score = getAverageScore(setupDetailsArray);

	const vexillographerDetailsFilePath = join(vexillographerDiffsFolderPath, "details.json");

	await writeTextFile(vexillographerDetailsFilePath, JSON.stringify(vexillographerDetails, null, "\t"));

	return vexillographerDetails;
};

export default handleVexillographer;
