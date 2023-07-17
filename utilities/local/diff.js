import { join } from "std/path";

import getDirectories from "./get-directories.js";
import handleVexillologist from "./diff/handle-vexillologist.js";

const rootFolderPath = "./data/vexillologists";
const diffsFolderPath = "./data/vexillologists";

// TODO: reinvestigate this
// instead of just one result with threshold 0, calculate multiple results with different thresholds
// 0, 0.1, 0.2, 0.4, 0.8
// then get the weighted average of the results, weighted by (1 - threshold), so that lower thresholds have more impact on the final score
//
// then also maybe try different sizes to simulate eye squinting lol...if the AI at least got some colors right somewhere, comparing smaller images should yield higher scores
// 4000px, 2000px, 1000px, 500px, 250px, 125px
// maybe different sizes like 10x because even at 125px it won't make much of a difference:
// 4000px, 400px, 40px, 4px
//
// also for now we only have "score" for parents, which is just the average, but maybe MSE or something else is better or just also interesting to look at
// we could even come up with some "manual" (still machine readable) scoring system based on multiple factors, like:
// - colors used in general
// - aspect ratio
// - markup size and complexity compared to reference (this could even give bonus points if some AI manages to make a smaller svg than wikipedia)
//
// score for descriptions maybe?

const vexillologists = await getDirectories(rootFolderPath);

await Promise.all(vexillologists.map((vexillologist) => {
	const vexillologistFolderPath = join(rootFolderPath, vexillologist);
	const vexillologistDiffsFolderPath = join(diffsFolderPath, vexillologist);

	return handleVexillologist({
		vexillologistFolderPath,
		vexillologistDiffsFolderPath
	});
}));
