import { join } from "std/path";

import getInstanceContent from "./get-instance-content.js";

const {
	errors: { NotFound },
	readDir,
	readTextFile
} = Deno;

/**
 *
 * @param options
 * @param options.staticVariantFolderPath
 * @param options.variantDiffsFolderPath
 */
const getInstances = async ({
	staticVariantFolderPath,
	variantDiffsFolderPath
}) => {
	const instances = {};

	const instanceEntries = [];

	for await (const {
		name: instanceName, isDirectory: instanceIsDirectory
	} of readDir(staticVariantFolderPath)) {
		if (instanceIsDirectory) {
			instanceEntries.push(instanceName);
		}
	}

	await Promise.all(instanceEntries.map(async (instanceName) => {
		const instanceDiffsFolderPath = join(variantDiffsFolderPath, instanceName);
		const detailsFilePath = join(instanceDiffsFolderPath, "details.json");
		let details = { score: 0 };

		try {
			details = JSON.parse(await readTextFile(detailsFilePath));
		}
		catch (error) {
			if (!(error instanceof NotFound)) {
				throw error;
			}
		}

		console.log("GETTING INSTANCE CONTENT", staticVariantFolderPath, instanceName);

		const instanceContent = await getInstanceContent({
			staticVariantFolderPath,
			instanceName,
			instanceDiffsFolderPath
		});

		console.log("GOT INSTANCE CONTENT", staticVariantFolderPath, instanceName);

		instances[instanceName] = {
			content: instanceContent,
			details
		};
	}));

	return instances;
};

export default getInstances;
