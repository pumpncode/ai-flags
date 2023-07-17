import rehypeStringify from "rehype-stringify";
import remarkBehead from "remark-behead";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 *
 * @param md
 */
const convertMdToHtml = async (md) => {
	const html = String(
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
			.process(md)
	);

	return html;
};

export default convertMdToHtml;
