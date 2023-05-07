import { join } from "std/path";

const {
	readDir
} = Deno;

const countries = await (await fetch("https://raw.githubusercontent.com/mledoze/countries/master/countries.json")).json();

/**
 *
 * @param options
 * @param options.staticVariantFolderPath
 * @param options.instanceName
 */
const getInstanceContent = async ({ staticVariantFolderPath, instanceName }) => {
	const instanceFolderPath = join(staticVariantFolderPath, instanceName);

	const instanceContent = [];

	for await (const {
		name: code, isDirectory: codeIsDirectory
	} of readDir(instanceFolderPath)) {
		if (codeIsDirectory) {
			const countryFolderPath = join(instanceFolderPath, code);

			const svgFlagFilePath = join(countryFolderPath, "flag.svg");
			const pngFlagFilePath = join(countryFolderPath, "flag.png");

			const createdAt = (new Date()).toISOString();

			instanceContent.push({
				name: countries.find(({ cca3 }) => cca3 === code.toLocaleUpperCase()).name.common,
				code,
				svgFlagPath: svgFlagFilePath.replace("static/", "/"),
				pngFlagPath: pngFlagFilePath.replace("static/", "/"),
				createdAt
			});
		}
	}

	const sortedInstanceContent = [...instanceContent].sort(({ name: nameA }, { name: nameB }) => (new Intl.Collator()).compare(nameA, nameB));

	return sortedInstanceContent;
};

export default getInstanceContent;
