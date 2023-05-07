import rehypeStringify from "rehype-stringify";
import remarkBehead from "remark-behead";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { join, relative } from "std/path";
import { unified } from "unified";

import { asset } from "$fresh/runtime.ts";

const {
	errors: {
		NotFound
	},
	readTextFile
} = Deno;

const config = {
	routeOverride: "/:vexillologist([a-z0-9.-]+)/:vexillographer([a-z0-9.-]+)/:variant([a-z0-9.-]+)/:instance([a-z0-9.-]+)/:code([a-z]{3})"
};

const handler = {
	GET: async (request, context) => {
		const {
			params: {
				vexillologist,
				vexillographer,
				variant,
				instance,
				code
			}
		} = context;

		const setupName = [
			vexillologist,
			vexillographer,
			variant,
			instance
		].join("/");

		const countries = await (await fetch("https://raw.githubusercontent.com/mledoze/countries/master/countries.json")).json();

		const countryFolderPath = join("./", "static", "setups", setupName, code.toLocaleLowerCase());

		const descriptionFilePath = join(countryFolderPath, "description.md");
		const commentsFilePath = join(countryFolderPath, "comments.md");
		const svgFlagFilePath = join(countryFolderPath, "flag.svg");
		const pngFlagFilePath = join(countryFolderPath, "flag.png");

		try {
			let description;

			try {
				const descriptionSource = await readTextFile(descriptionFilePath);

				description = String(
					await unified()
						.use(remarkParse)
						.use(remarkGfm)
						.use(() => (tree) => ({
							...tree,
							children: tree.children.filter(({ type, depth }) => type !== "heading" || depth > 1)
						}))
						.use(remarkBehead, { depth: 2 })
						.use(remarkRehype)
						.use(rehypeStringify)
						.process(descriptionSource)
				);
			}
			catch (error) {
				console.error(error);
			}

			let comments;

			try {
				const commentsSource = await readTextFile(commentsFilePath);

				comments = String(
					await unified()
						.use(remarkParse)
						.use(remarkGfm)
						.use(remarkRehype)
						.use(rehypeStringify)
						.process(commentsSource)
				);
			}
			catch (error) {
				if (!error instanceof NotFound) {
					throw error;
				}
			}

			const content = {
				name: countries.find(({ cca3 }) => cca3 === code.toLocaleUpperCase()).name.common,
				code,
				description,
				comments,
				svgFlagPath: relative(setupName, svgFlagFilePath).replace("static/", ""),
				pngFlagPath: relative(setupName, pngFlagFilePath).replace("static/", ""),
				setupName
			};

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

/**
 *
 * @param props
 * @param props.data
 * @param props.data.content
 * @param props.data.content
 * @param props.data.content.name
 * @param props.data.content.code
 * @param props.data.content.pngFlagPath
 * @param props.data.content.description
 * @param props.data.content.setupName
 * @param props.data.content.comments
 */
const FlagDetails = ({
	data: {
		content, content: {
			name, code, pngFlagPath, description, setupName, comments
		}
	}
}) => (
	<section className="p-4 md:p-16 min-h-[calc(100vh-12rem)]">
		<h2 className="flex items-center h-24 gap-2">
			<span>{name}</span>
			<span className="text-base font-mono bg-neutral-700 px-1 py-0.5 rounded">({code})</span>
		</h2>

		<section className="flex flex-col sm:flex-row gap-4 min-h-[calc(100vh-26rem)]">
			<div className="flex items-start justify-center w-full min-h-full p-2 rounded bg-neutral-700">
				<img
					src={asset(pngFlagPath)}
					alt={`Flag of ${name} (according to ${setupName})`}
					className="max-w-full max-h-[max(16rem,calc(100vh-23rem))] border border-neutral-800"
					style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}
				/>
			</div>

			<div className="flex flex-col w-full min-h-full p-4 rounded gap-4 bg-neutral-700">
				<div className="flex flex-col p-4 rounded gap-4 bg-neutral-600">
					<h3 className="text-3xl font-medium">Description</h3>
					<section className="text-justify max-w-prose markdown"
						dangerouslySetInnerHTML={{ __html: String(description) }}
					/>
				</div>

				{comments && (
					<div className="flex flex-col p-4 rounded gap-4 bg-neutral-600">
						<h3 className="text-3xl font-medium">Comments</h3>
						<section className="text-justify max-w-prose markdown"
							dangerouslySetInnerHTML={{ __html: String(comments) }}
						/>
					</div>
				)}
			</div>
		</section>

	</section>
);

export { config, handler };

export default FlagDetails;
