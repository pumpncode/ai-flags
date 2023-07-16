import { join } from "std/path";

const {
	cwd,
	errors: {
		NotFound
	},
	readDir,
	readTextFile
} = Deno;

const countries = JSON.parse(await readTextFile(join(cwd(), "static", "countries.json")));

/**
 *
 * @param options
 * @param options.staticVariantFolderPath
 * @param options.instanceName
 * @param options.instanceDiffsFolderPath
 */
const getInstanceContent = async ({
	staticVariantFolderPath,
	instanceName,
	instanceDiffsFolderPath
}) => {
	const instanceFolderPath = join(staticVariantFolderPath, instanceName);

	const instanceContent = [];

	const instanceContentEntries = [];

	for await (const {
		name: code, isDirectory: codeIsDirectory
	} of readDir(instanceFolderPath)) {
		if (codeIsDirectory) {
			instanceContentEntries.push(code);
		}
	}

	await Promise.all(instanceContentEntries.map(async (code) => {
		const countryFolderPath = join(instanceFolderPath, code);

		const svgFlagFilePath = join(countryFolderPath, "flag.svg");
		const pngFlagFilePath = join(countryFolderPath, "flag.png");
		const contentDiffsFolderPath = join(instanceDiffsFolderPath, code);

		const descriptionFilePath = join(countryFolderPath, "description.md");
		const description = await readTextFile(descriptionFilePath);

		const commentsFilePath = join(countryFolderPath, "comments.md");
		let comments = null;

		try {
			comments = await readTextFile(commentsFilePath);
		}
		catch (error) {
			if (!(error instanceof NotFound)) {
				throw error;
			}
		}

		const detailsFilePath = join(contentDiffsFolderPath, "details.json");
		let details = { score: 0 };

		try {
			details = JSON.parse(await readTextFile(detailsFilePath));
		}
		catch (error) {
			if (!(error instanceof NotFound)) {
				throw error;
			}
		}

		const createdAt = (new Date()).toISOString();

		instanceContent.push({
			name: countries.find(({ cca3 }) => cca3 === code.toLocaleUpperCase()).name.common,
			code,
			svgFlagPath: svgFlagFilePath.replace("static/", "/"),
			pngFlagPath: pngFlagFilePath.replace("static/", "/"),
			description,
			comments,
			createdAt,
			details
		});
	}));

	const sortedInstanceContent = [...instanceContent].sort(({ name: nameA }, { name: nameB }) => (new Intl.Collator()).compare(nameA, nameB));

	return sortedInstanceContent;
};

export default getInstanceContent;
