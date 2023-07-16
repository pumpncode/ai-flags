import { basename, join } from "std/path";

import calculateScore from "./process-entity/calculate-score.js";

const {
	mkdir,
	writeTextFile
} = Deno;

const rootFolderPath = "./static/setups";

/**
 *
 * @param options
 * @param options.entityFolderPath
 * @param options.entityDiffsFolderPath
 * @param options.diffFilePath
 * @param options.entity
 * @param options.entityDetailsFilePath
 * @param options.entityDetails
 */
const processEntity = async ({
	entityFolderPath,
	entityDiffsFolderPath,
	diffFilePath,
	entityDetailsFilePath,
	entityDetails
}) => {
	await mkdir(entityDiffsFolderPath, { recursive: true });

	const flagFilePath = join(entityFolderPath, "flag.png");

	let score = 0;

	const entity = basename(entityFolderPath);

	try {
		const referenceFlagFilePath = join(
			rootFolderPath,
			"wikipedia",
			"wikipedia",
			"1",
			"1",
			entity,
			"flag.png"
		);

		score = await calculateScore({
			testFilePath: flagFilePath,
			referenceFilePath: referenceFlagFilePath,
			diffFilePath
		});

		await writeTextFile(
			entityDetailsFilePath,
			JSON.stringify(
				{
					...entityDetails,
					score
				},
				null,
				"\t"
			)
		);
	}
	catch (error) {
		console.log(error);
	}

	return score;
};

export default processEntity;
