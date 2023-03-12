import { join } from "std/path";

import TreeMenu from "@ai-flags/components/layout/tree-menu.jsx";

const {
	readDir,
	readTextFile
} = Deno;

const handler = {
	GET: async (request, context) => {
		const rootFolderPath = join("./");

		const staticFolderPath = join(rootFolderPath, "static");

		const entityTreeFilePath = join(staticFolderPath, "entity-tree.json");

		const entityTree = JSON.parse(await readTextFile(entityTreeFilePath));

		return context.render({
			entityTree
		});
	}
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.entityTree
 */
const Entities = ({ data: { entityTree } }) => {
	const [[earthEntityId, earthEntityObject]] = Object.entries(entityTree.children);

	const earthEntity = {
		id: earthEntityId,
		...earthEntityObject
	};

	return (
		<section className="p-4 md:p-16">
			<h2 className="text-mono h-24">Entities</h2>
			<div className="flex flex-col md:flex-row gap-4">
				<TreeMenu rootEntity={earthEntity} href="/entities" className="w-full md:w-3/12" />
			</div>
		</section>
	);
};

export { handler };

export default Entities;
