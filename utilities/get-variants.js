import rehypeStringify from "rehype-stringify";
import remarkBehead from "remark-behead";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { join } from "std/path";
import { unified } from "unified";

import getInstances from "./get-instances.js";

const {
	readDir,
	readTextFile
} = Deno;

/**
 *
 * @param options
 * @param options.vexillographerFolderPath
 * @param options.vexillologistName
 * @param options.vexillographerName
 * @param options.staticSetupsFolderPath
 */
const getVariants = async ({
	vexillographerFolderPath,
	vexillologistName,
	vexillographerName,
	staticSetupsFolderPath
}) => {
	const variants = {};

	for await (const {
		name: variantName, isDirectory: variantIsDirectory
	} of readDir(vexillographerFolderPath)) {
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

export default getVariants;
