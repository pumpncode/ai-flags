import { join } from "std/path";

import handleVexillographer from "./handle-vexillologist/handle-vexillographer.js";
import getAverageScore from "./handle-vexillologist/get-average-score.js";

import getDirectories from "@/utilities/local/get-directories.js";

const {
	mkdir,
	writeTextFile
} = Deno;

/**
 *
 * @param vexillologist
 * @param rootFolderPath
 * @param diffsFolderPath
 * @param vexillologist.vexillologistFolderPath
 * @param vexillologist.vexillologistDiffsFolderPath
 */
const handleVexillologist = async ({
	vexillologistFolderPath,
	vexillologistDiffsFolderPath
}) => {
	await mkdir(vexillologistDiffsFolderPath, { recursive: true });

	const vexillologistDetails = {};

	const vexillographers = await getDirectories(vexillologistFolderPath);
	const vexillographerDetailsArray = await Promise.all(
		vexillographers
			.map((vexillographer) => {
				const vexillographerFolderPath = join(vexillologistFolderPath, vexillographer);
				const vexillographerDiffsFolderPath = join(vexillologistDiffsFolderPath, vexillographer);

				return handleVexillographer({
					vexillographerFolderPath,
					vexillographerDiffsFolderPath
				});
			})
	);

	vexillologistDetails.score = getAverageScore(vexillographerDetailsArray);

	const vexillologistDetailsFilePath = join(vexillologistDiffsFolderPath, "details.json");

	await writeTextFile(vexillologistDetailsFilePath, JSON.stringify(vexillologistDetails, null, "\t"));
};

export default handleVexillologist;
