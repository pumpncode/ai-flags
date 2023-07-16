import { join } from "std/path";

import getInstances from "./get-instances.js";

const {
	errors: { NotFound },
	readDir,
	readTextFile
} = Deno;

/**
 *
 * @param options
 * @param options.vexillographerFolderPath
 * @param options.vexillologistName
 * @param options.vexillographerName
 * @param options.staticSetupsFolderPath
 * @param options.vexillographerDiffsFolderPath
 */
const getVariants = async ({
	vexillographerFolderPath,
	vexillologistName,
	vexillographerName,
	staticSetupsFolderPath,
	vexillographerDiffsFolderPath
}) => {
	const variants = {};

	const variantEntries = [];

	for await (const {
		name: variantName,
		isDirectory: variantIsDirectory
	} of readDir(vexillographerFolderPath)) {
		if (variantIsDirectory) {
			variantEntries.push(variantName);
		}
	}

	await Promise.all(variantEntries.map(async (variantName) => {
		const variantFolderPath = join(vexillographerFolderPath, variantName);
		const variantDiffsFolderPath = join(vexillographerDiffsFolderPath, variantName);

		const detailsFilePath = join(variantDiffsFolderPath, "details.json");
		let details = { score: 0 };

		try {
			details = JSON.parse(await readTextFile(detailsFilePath));
		}
		catch (error) {
			if (!(error instanceof NotFound)) {
				throw error;
			}
		}

		const descriptionFilePath = join(variantFolderPath, "description.md");

		const description = await readTextFile(descriptionFilePath);

		const fullName = [
			vexillologistName,
			vexillographerName,
			variantName
		].join("/");

		const variant = {
			description,
			fullName,
			details
		};

		const staticVariantFolderPath = join(staticSetupsFolderPath, fullName);

		const instances = await getInstances({
			staticVariantFolderPath,
			variantDiffsFolderPath
		});

		variants[variantName] = {
			...variant,
			instances
		};
	}));

	return variants;
};

export default getVariants;
