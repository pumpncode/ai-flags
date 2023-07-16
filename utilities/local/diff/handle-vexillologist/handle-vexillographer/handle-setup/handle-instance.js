import { join } from "std/path";

import handleEntity from "./handle-setup/handle-entity.js";

import getAverageScore from "@/utilities/local/diff/handle-vexillologist/get-average-score.js";
import getDirectories from "@/utilities/local/get-directories.js";

const {
	mkdir,
	writeTextFile
} = Deno;

/**
 *
 * @param instance
 * @param setupFolderPath
 * @param setupDiffsFolderPath
 * @param instance.instanceFolderPath
 * @param instance.instanceDiffsFolderPath
 */
const handleInstance = async ({
	instanceFolderPath,
	instanceDiffsFolderPath
}) => {
	await mkdir(instanceDiffsFolderPath, { recursive: true });

	const instanceDetails = {};

	const entities = await getDirectories(instanceFolderPath);
	const entityDetailsArray = await Promise.all(entities.map((entity) => {
		const entityFolderPath = join(instanceFolderPath, entity);
		const entityDiffsFolderPath = join(instanceDiffsFolderPath, entity);

		return handleEntity({
			entityFolderPath,
			entityDiffsFolderPath
		});
	}));

	instanceDetails.score = getAverageScore(entityDetailsArray);

	const instanceDetailsFilePath = join(instanceDiffsFolderPath, "details.json");

	await writeTextFile(instanceDetailsFilePath, JSON.stringify(instanceDetails, null, "\t"));

	return instanceDetails;
};

export default handleInstance;
