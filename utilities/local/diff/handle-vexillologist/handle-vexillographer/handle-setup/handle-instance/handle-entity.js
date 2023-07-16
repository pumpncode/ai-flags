/* eslint-disable max-statements */

import { join } from "std/path";

import processEntity from "./handle-entity/process-entity.js";

const {
	errors: {
		NotFound
	},
	readTextFile,
	rename,
	stat
} = Deno;

/**
 *
 * @param entity
 * @param instanceFolderPath
 * @param instanceDiffsFolderPath
 * @param entity.entityFolderPath
 * @param entity.entityDiffsFolderPath
 */
const handleEntity = async ({
	entityFolderPath,
	entityDiffsFolderPath
}) => {
	const diffFilePath = join(entityDiffsFolderPath, "diff.png");

	const entityDetails = {};
	const oldEntityDetailsFilePath = join(entityFolderPath, "details.json");
	const entityDetailsFilePath = join(entityDiffsFolderPath, "details.json");

	try {
		await stat(oldEntityDetailsFilePath);
		await rename(oldEntityDetailsFilePath, entityDetailsFilePath);
	}
	catch (error) {
		if (!(error instanceof NotFound)) {
			throw error;
		}
	}

	let alreadyProcessed = false;

	try {
		await stat(diffFilePath);
		await stat(entityDetailsFilePath);

		alreadyProcessed = true;

		entityDetails.score = JSON.parse(await readTextFile(entityDetailsFilePath)).score;
	}
	catch (error) {
		if (!(error instanceof NotFound)) {
			throw error;
		}
	}

	if (!alreadyProcessed) {
		entityDetails.score = await processEntity({
			entityFolderPath,
			entityDiffsFolderPath,
			diffFilePath,
			entityDetailsFilePath,
			entityDetails
		});
	}

	return entityDetails;
};

export default handleEntity;
