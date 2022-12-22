import { join } from "std/path";
import { asset } from "$fresh/runtime.ts";
import { cx, css } from "twind";

import countries from "https://raw.githubusercontent.com/mledoze/countries/master/countries.json" assert { type: "json" };
import setupNames from "../setup-names.json" assert { type: "json" };

const {
	readDir,
	readTextFile
} = Deno;

const handler = {
	GET: async (request, context) => {
		const content = {};

		const setupsFolderPath = join("./", "static", "setups");

		for (const setupName of setupNames) {
			const folderPath = join(setupsFolderPath, setupName);

			const setupContent = [];

			for await (const { name: code, isDirectory: codeIsDirectory } of readDir(folderPath)) {
				if (codeIsDirectory) {
					const countryFolderPath = join(folderPath, code);

					const descriptionFilePath = join(countryFolderPath, "description.txt");
					const svgFlagFilePath = join(countryFolderPath, "flag.svg");
					const pngFlagFilePath = join(countryFolderPath, "flag.png");

					const description = await readTextFile(descriptionFilePath);

					setupContent.push({
						name: countries.find(({ cca3 }) => cca3 === code.toLocaleUpperCase()).name.common,
						code,
						description,
						svgFlagPath: svgFlagFilePath.replace("static/", ""),
						pngFlagPath: pngFlagFilePath.replace("static/", "")
					});
				}
			}

			content[setupName] = [...setupContent].sort((({ name: nameA }, { name: nameB }) => Intl.Collator().compare(nameA, nameB)));
		}

		return context.render({
			content
		});
	},
};

const Home = ({ data: { content } }) => {
	return (
		<section className="p-16">
			<h2 className="text-mono h-24">Flags (according to AI)</h2>
			<ul>
				{
					Object.entries(content).sort(([setupNameA], [setupNameB]) => Intl.Collator().compare(setupNameA, setupNameB)).map(([setupName, setupContent], index) => (
						<li key={index} className="border border-neutral-600 first-child:border-b-0 p-4">

							<h3>{setupName}</h3>
							<article>
								<ul className="grid grid-cols-5 gap-4">
									{
										setupContent.map(({ name, code, description, pngFlagPath }, index) => (
											<li className="w-full h-48" key={index}>
												<a href={`/${setupName}/${code}`}>
													<figure className="flex flex-col gap-2 w-full h-full justify-between items-center p-2 border border-neutral-600 rounded hover:bg-neutral-700">
														<div className="w-full flex items-center justify-center h-36 p-2 bg-neutral-700 rounded">
															<img
																src={asset(pngFlagPath)}
																alt={`Flag of ${name} (according to ${setupName})`}
																className={cx`
																	max-w-full max-h-full border border-neutral-800
																	${css({ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" })}
																`}
															/>
														</div>

														<figcaption className="h-6 flex gap-2 items-center justify-center">
															<span className="text-sm">{name}</span>
															<span className="text-xs font-mono bg-neutral-700 px-1 py-0.5 rounded">({code})</span>
														</figcaption>
													</figure>
												</a>
											</li>
										))
									}
								</ul>
							</article>
						</li>
					))
				}
			</ul>

		</section>
	);
};

export { handler };

export default Home;
