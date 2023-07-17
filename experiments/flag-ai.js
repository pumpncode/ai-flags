import Vexillographer from "./flag-ai/vexillographer.js";

// const referenceImages = await loadReferenceImages();

// console.log(referenceImages.length);

const numberOfVexillographers = 5;

let vexillographers = Array(numberOfVexillographers)
	.fill()
	.map(() => new Vexillographer());

const numberOfGenerations = 100;

for (let currentGeneration = 0; currentGeneration < numberOfGenerations; currentGeneration++) {
	console.info("Generation", currentGeneration);

	await Promise.all(
		vexillographers.map(async (vexillographer) => {
			vexillographer.mutate();
			await vexillographer.calculateScore("che");

			return vexillographer;
		})
	);

	const half = Math.floor(numberOfVexillographers / 2);
	const quarter = Math.floor(half / 2);

	vexillographers = [
		...vexillographers
			.toSorted(({ score: scoreA }, { score: scoreB }) => scoreB - scoreA)
			.slice(0, half),
		...vexillographers
			.slice(0, quarter)
			.map((vexillographer) => vexillographer.clone()),
		...Array(quarter)
			.fill()
			.map(() => new Vexillographer())
	];

	console.log(vexillographers.map(({ score }) => score));
}
