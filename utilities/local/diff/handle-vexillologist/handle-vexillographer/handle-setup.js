import { join } from "std/path";

import handleInstance from "./handle-setup/handle-instance.js";

import getAverageScore from "@/utilities/local/diff/handle-vexillologist/get-average-score.js";
import getDirectories from "@/utilities/local/get-directories.js";

const {
	mkdir,
	writeTextFile
} = Deno;

/**
 *
 * @param setup
 * @param vexillographerFolderPath
 * @param vexillographerDiffsFolderPath
 * @param setup.setupFolderPath
 * @param setup.setupDiffsFolderPath
 */
const handleSetup = async ({
	setupFolderPath,
	setupDiffsFolderPath
}) => {
	await mkdir(setupDiffsFolderPath, { recursive: true });

	const setupDetails = {};

	const instances = await getDirectories(setupFolderPath);
	const instanceDetailsArray = await Promise.all(instances.map((instance) => {
		const instanceFolderPath = join(setupFolderPath, instance);
		const instanceDiffsFolderPath = join(setupDiffsFolderPath, instance);

		return handleInstance({
			instanceFolderPath,
			instanceDiffsFolderPath
		});
	}));

	setupDetails.score = getAverageScore(instanceDetailsArray);

	const setupDetailsFilePath = join(setupDiffsFolderPath, "details.json");

	await writeTextFile(setupDetailsFilePath, JSON.stringify(setupDetails, null, "\t"));

	return setupDetails;
};

export default handleSetup;
