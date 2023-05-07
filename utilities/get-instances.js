import getInstanceContent from "./get-instance-content.js";

const {
	errors: { NotFound },
	readDir
} = Deno;

/**
 *
 * @param options
 * @param options.staticVariantFolderPath
 */
const getInstances = async ({ staticVariantFolderPath }) => {
	const instances = {};

	try {
		for await (const {
			name: instanceName, isDirectory: instanceIsDirectory
		} of readDir(staticVariantFolderPath)) {
			if (instanceIsDirectory) {
				const instanceContent = await getInstanceContent({
					staticVariantFolderPath,
					instanceName
				});

				instances[instanceName] = instanceContent;
			}
		}
	}
	catch (error) {
		if (!(error instanceof NotFound)) {
			throw error;
		}
	}

	return instances;
};

export default getInstances;
