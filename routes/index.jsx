import rehypeStringify from "rehype-stringify";
import remarkBehead from "remark-behead";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { join } from "std/path";
import { unified } from "unified";

import VexillologistsList from "../components/features/vexillologists-list.jsx";

const {
	errors: {
		NotFound
	},
	readDir,
	readTextFile,
	stat
} = Deno;

const countries = await (await fetch("https://raw.githubusercontent.com/mledoze/countries/master/countries.json")).json();

const rootFolderPath = join("./");

const setupsFolderPath = join(rootFolderPath, "setups");

const staticFolderPath = join(rootFolderPath, "static");

const staticSetupsFolderPath = join(staticFolderPath, "setups");

const getInstances = async ({ staticVariantFolderPath }) => {
	const instances = {};

	for await (
		const {
			name: instanceName,
			isDirectory: instanceIsDirectory
		} of readDir(staticVariantFolderPath)
	) {
		if (instanceIsDirectory) {
			const instanceFolderPath = join(staticVariantFolderPath, instanceName);

			const instanceContent = [];

			for await (
				const {
					name: code,
					isDirectory: codeIsDirectory
				} of readDir(instanceFolderPath)
			) {
				if (codeIsDirectory) {
					const countryFolderPath = join(instanceFolderPath, code);

					const svgFlagFilePath = join(countryFolderPath, "flag.svg");
					const pngFlagFilePath = join(countryFolderPath, "flag.png");

					let createdAt = null;

					try {
						console.log("svgFlagFilePath", svgFlagFilePath);
						const stat = await stat(svgFlagFilePath);

						console.log("stat", stat);

						const { birthtime } = stat;

						console.log("birthtime", birthtime);

						createdAt = birthtime.toISOString();
					}
					catch (error) {
						// if (!(error instanceof NotFound)) {
						// 	throw error;
						// }
						// do nothing

						throw error;
					}

					if (createdAt !== null) {
						instanceContent.push({
							// eslint-disable-next-line max-len
							name: countries.find(({ cca3 }) => cca3 === code.toLocaleUpperCase()).name.common,
							code,
							svgFlagPath: svgFlagFilePath.replace("static/", ""),
							pngFlagPath: pngFlagFilePath.replace("static/", ""),
							createdAt
						});
					}
				}
			}

			instances[instanceName] = [...instanceContent].sort(({ name: nameA }, { name: nameB }) => (new Intl.Collator()).compare(nameA, nameB));
		}
	}

	return instances;
};

const getVariants = async ({
	vexillographerFolderPath, vexillologistName, vexillographerName
}) => {
	const variants = {};

	for await (
		const {
			name: variantName,
			isDirectory: variantIsDirectory
		} of readDir(vexillographerFolderPath)
	) {
		if (variantIsDirectory) {
			const variantFolderPath = join(vexillographerFolderPath, variantName);

			const descriptionFilePath = join(variantFolderPath, "description.md");

			const descriptionSource = await readTextFile(descriptionFilePath);

			const description = String(
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

			const fullName = [
				vexillologistName,
				vexillographerName,
				variantName
			].join("/");

			const variant = {
				description,
				fullName
			};

			const staticVariantFolderPath = join(staticSetupsFolderPath, fullName);

			const instances = await getInstances({ staticVariantFolderPath });

			variants[variantName] = {
				...variant,
				instances
			};
		}
	}

	return variants;
};

const getVexillographers = async ({ vexillologistFolderPath, vexillologistName }) => {
	const vexillographers = {};

	for await (
		const {
			name: vexillographerName,
			isDirectory: vexillographerIsDirectory
		} of readDir(vexillologistFolderPath)
	) {
		if (vexillographerIsDirectory) {
			const vexillographerFolderPath = join(vexillologistFolderPath, vexillographerName);

			const variants = await getVariants({
				vexillographerFolderPath,
				vexillologistName,
				vexillographerName
			});

			vexillographers[vexillographerName] = variants;
		}
	}

	return vexillographers;
};

const getVexillologists = async () => {
	const vexillologists = {};

	for await (
		const {
			name: vexillologistName,
			isDirectory: vexillologistIsDirectory
		} of readDir(setupsFolderPath)
	) {
		if (vexillologistIsDirectory) {
			const vexillologistFolderPath = join(setupsFolderPath, vexillologistName);

			const vexillographers = await getVexillographers({
				vexillologistFolderPath,
				vexillologistName
			});

			vexillologists[vexillologistName] = vexillographers;
		}
	}

	return vexillologists;
};

const handler = {
	// eslint-disable-next-line max-statements
	GET: async (request, context) => {
		const vexillologists = await getVexillologists();

		return context.render({
			vexillologists
		});
	}
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.content
 * @param props.data.vexillologists
 */
const Home = ({ data: { vexillologists } }) => (
	<section className="p-4 md:p-16 flex flex-col gap-8 items-start">
		<h2 className="text-2xl sm:text-4xl">Flags (according to AI)</h2>
		<span className="flex flex-col gap-1 text-lg text-cyan-300 font-medium">
			<span>What would happen if we ask an AI to describe a flag?</span>
			<span>What if we ask it to generate an image of a flag?</span>
			<span>Find out here!</span>
		</span>
		<span className="flex flex-col gap-1 text-lg bg-neutral-700 p-4 rounded border-2 border-cyan-300">
			<span>Click on the "Instance" boxes below to see the results of a specific setup</span>
			<span>Click on a specific flag to view a bigger version and read the description of it</span>
			<span>You can always get the SVG version of a flag by simply replacing the file extenstion in the URL</span>
		</span>

		<ul className="flex flex-col gap-1">
			<li className="flex gap-2">
				<span>🤓</span>
				<span> - The Vexillologist - The role which describes a flag</span>
			</li>
			<li className="flex gap-2">
				<span>🧑‍🎨</span>
				<span> - The Vexillographer - The role which constructs a flag</span>
			</li>
		</ul>
		<VexillologistsList {...{ vexillologists }} />
	</section>
);

export { handler };

export default Home;
