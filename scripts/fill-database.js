import { join } from "std/path";

import { getVexillologists, supabase } from "@/utilities/local.js";

const rootFolderPath = join("./");

const setupsFolderPath = join(rootFolderPath, "setups");

const staticFolderPath = join(rootFolderPath, "static");

const staticSetupsFolderPath = join(staticFolderPath, "setups");

const staticDiffsFolderPath = join(staticFolderPath, "diffs");

const vexillologists = await getVexillologists({
	setupsFolderPath,
	staticSetupsFolderPath,
	staticDiffsFolderPath
});

const { error: truncateVexillologistsError } = await supabase
	.rpc("truncate_vexillologists");

const { error: ensureConstraintsError } = await supabase
	.rpc("ensure_constraints");

const { data: dbVexillologists, error: vexillologistsError } = await supabase
	.from("vexillologists")
	.insert(
		Object.entries(vexillologists)
			.map(([vexillologistName, { details: { score } }]) => ({
				name: vexillologistName,
				score
			}))
	)
	.select();

if (vexillologistsError) {
	throw vexillologistsError;
}

for (const { id: vexillologistId, name: vexillologistName } of dbVexillologists) {
	console.log("filling vexillographers of", vexillologistName);
	const { vexillographers } = vexillologists[vexillologistName];

	const { data: dbVexillographers, error: vexillographersError } = await supabase
		.from("vexillographers")
		.insert(
			Object.entries(vexillographers)
				.map(([vexillographerName, { details: { score } }]) => ({
					name: vexillographerName,
					score,
					vexillologistId
				}))
		)
		.select();

	for (const { id: vexillographerId, name: vexillographerName } of dbVexillographers) {
		console.log("filling variants of", vexillologistName, vexillographerName);
		const { variants } = vexillographers[vexillographerName];

		const { data: dbVariants, error: variantsError } = await supabase
			.from("variants")
			.insert(
				Object.entries(variants)
					.map(([
						variantName,
						{
							description,
							details: {
								score
							}
						}
					]) => ({
						name: variantName,
						score,
						description,
						vexillographerId
					}))
			)
			.select();

		for (const { id: variantId, name: variantName } of dbVariants) {
			console.log("filling instances of", vexillologistName, vexillographerName, variantName);
			const { instances } = variants[variantName];

			const { data: dbInstances, error: instancesError } = await supabase
				.from("instances")
				.insert(
					Object.entries(instances)
						.map(([instanceName, { details: { score } }]) => ({
							name: instanceName,
							score,
							variantId
						}))
				)
				.select();

			for (const { id: instanceId, name: instanceName } of dbInstances) {
				console.log("filling flags of", vexillologistName, vexillographerName, variantName, instanceName);
				const { content: flags } = instances[instanceName];

				const { data: dbFlags, error: flagsError } = await supabase
					.from("flags")
					.insert(
						flags
							.map(({
								name,
								code,
								description,
								comments,
								details: {
									score
								}
							}) => ({
								name,
								code,
								score,
								description,
								comments,
								instanceId
							}))
					)
					.select();

				console.log("filled flags of", vexillologistName, vexillographerName, variantName, instanceName);
			}
			console.log("filled instances of", vexillologistName, vexillographerName, variantName);
		}
		console.log("filled variants of", vexillologistName, vexillographerName);
	}
	console.log("filled vexillographers of", vexillologistName);
}
