import { join } from "std/path";

import SetupListItem from "@ai-flags/islands/setup-list-item.jsx";

const {
	readDir,
	readTextFile
} = Deno;

const handler = {
	GET: async (request, context) => {
		const content = {};

		const countries = await (await fetch("https://raw.githubusercontent.com/mledoze/countries/master/countries.json")).json();

		const rootFolderPath = join("./");

		const setupNamesFilePath = join(rootFolderPath, "setup-names.json");

		const setupNames = JSON.parse(await readTextFile(setupNamesFilePath));

		const staticFolderPath = join(rootFolderPath, "static");

		const setupsFolderPath = join(staticFolderPath, "setups");

		for (const setupName of setupNames) {
			const folderPath = join(setupsFolderPath, setupName);

			const setupContent = [];

			for await (const { name: code, isDirectory: codeIsDirectory } of readDir(folderPath)) {
				if (codeIsDirectory) {
					const countryFolderPath = join(folderPath, code);

					const svgFlagFilePath = join(countryFolderPath, "flag.svg");
					const pngFlagFilePath = join(countryFolderPath, "flag.png");

					setupContent.push({
						name: countries.find(({ cca3 }) => cca3 === code.toLocaleUpperCase()).name.common,
						code,
						svgFlagPath: svgFlagFilePath.replace("static/", ""),
						pngFlagPath: pngFlagFilePath.replace("static/", "")
					});
				}
			}

			content[setupName] = [...setupContent].sort(({ name: nameA }, { name: nameB }) => Intl.Collator().compare(nameA, nameB));
		}

		return context.render({
			content
		});
	}
};

/**
 *
 * @param root0
 * @param root0.data
 * @param root0.data.content
 */
const Home = ({ data: { content } }) => (
	<section className="p-16">
		<h2 className="text-mono h-24">Flags (according to AI)</h2>
		<ul>
			{
				Object.entries(content).sort(([setupNameA], [setupNameB]) => Intl.Collator().compare(setupNameA, setupNameB)).map(([setupName, setupContent], index) => (
					<SetupListItem
						key={index}
						name={setupName}
						flags={setupContent}
					/>
				))
			}
		</ul>

	</section>
);

export { handler };

export default Home;
