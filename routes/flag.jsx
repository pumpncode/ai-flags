import { join, relative } from "std/path";
import { asset } from "$fresh/runtime.ts";
import { cx, css } from "twind";

import countries from "https://raw.githubusercontent.com/mledoze/countries/master/countries.json" assert { type: "json" };

const {
	readTextFile
} = Deno;

const config = {
	routeOverride: "/{:setupName([a-z0-9/-])}+:code([a-z]{3})"
};

const handler = {
	GET: async (request, context) => {
		const {
			params: {
				setupName,
				code
			}
		} = context;

		const countryFolderPath = join("./", "static", "setups", setupName, code.toLocaleLowerCase());

		const descriptionFilePath = join(countryFolderPath, "description.txt");
		const svgFlagFilePath = join(countryFolderPath, "flag.svg");
		const pngFlagFilePath = join(countryFolderPath, "flag.png");

		try {
			const description = await readTextFile(descriptionFilePath);

			const content = {
				name: countries.find(({ cca3 }) => cca3 === code.toLocaleUpperCase()).name.common,
				code,
				description,
				svgFlagPath: relative(setupName, svgFlagFilePath).replace("static/", ""),
				pngFlagPath: relative(setupName, pngFlagFilePath).replace("static/", ""),
				setupName
			}

			return context.render({
				content
			});
		}
		catch (error) {
			return new Response("Not found", {
				status: 404
			});
		}
	}
};

const FlagDetails = ({ data: { content, content: { name, code, pngFlagPath, description, setupName } } }) => {
	return (
		<section className="p-16 max-h-[calc(100vh-12rem)]">
			<h2 className="flex gap-2 items-center h-24">
				<span>{name}</span>
				<span className="text-base font-mono bg-neutral-700 px-1 py-0.5 rounded">({code})</span>
			</h2>

			<section className="flex gap-4 h-[calc(100vh-26rem)]">
				<div className="w-full flex justify-center p-2 bg-neutral-700 h-full">
					<img
						src={asset(pngFlagPath)}
						alt={`Flag of ${name} (according to ${setupName})`}
						className={cx`
							max-w-full max-h-full border border-neutral-800
							${css({ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" })}
						`}
					/>
				</div>

				<div className="w-full flex flex-col p-2 bg-neutral-700 h-full">
					<p className="max-w-prose">{description}</p>
				</div>
			</section>


		</section>
	)
};

export { config, handler };

export default FlagDetails;