import rehypeStringify from "rehype-stringify";
import remarkBehead from "remark-behead";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { join, relative } from "std/path";
import { css, cx } from "twind";
import { unified } from "unified";

import { asset } from "$fresh/runtime.ts";

const {
	errors: {
		NotFound
	},
	readTextFile
} = Deno;

const config = {
	routeOverride: "/{:setupName([a-z0-9-]+[/])}+:code([a-z]{3})"
};

const handler = {
	GET: async (request, context) => {
		const {
			params: {
				setupName,
				code
			}
		} = context;

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
 * @param root0
 * @param root0.data
 * @param root0.data.content
 * @param root0.data.content
 * @param root0.data.content.name
 * @param root0.data.content.code
 * @param root0.data.content.pngFlagPath
 * @param root0.data.content.description
 * @param root0.data.content.setupName
 * @param root0.data.content.comments
 */
const FlagDetails = ({
	data: {
		content, content: {
			name, code, pngFlagPath, description, setupName, comments
		}
	}
}) => (
	<section className="p-4 md:p-16 min-h-[calc(100vh-12rem)]">
		<h2 className="flex gap-2 items-center h-24">
			<span>{name}</span>
			<span className="text-base font-mono bg-neutral-700 px-1 py-0.5 rounded">({code})</span>
		</h2>

		<section className="flex flex-col sm:flex-row gap-4 min-h-[calc(100vh-26rem)]">
			<div className="w-full flex items-start justify-center p-2 bg-neutral-700 rounded min-h-full">
				<img
					src={asset(pngFlagPath)}
					alt={`Flag of ${name} (according to ${setupName})`}
					className={cx`
							max-w-full max-h-[max(16rem,calc(100vh-23rem))] border border-neutral-800
							${css({ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" })}
						`}
				/>
			</div>

			<div className="w-full flex flex-col gap-4 p-4 bg-neutral-700 min-h-full rounded">
				<div className="flex flex-col gap-4 p-4 bg-neutral-600 rounded">
					<h3 className="text-3xl font-medium">Description</h3>
					<section className="max-w-prose text-justify markdown"
						dangerouslySetInnerHTML={{ __html: String(description) }}
					/>
				</div>

				{comments && (
					<div className="flex flex-col gap-4 p-4 bg-neutral-600 rounded">
						<h3 className="text-3xl font-medium">Comments</h3>
						<section className="max-w-prose text-justify markdown"
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
