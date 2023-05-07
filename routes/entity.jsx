import { join } from "std/path";

import TreeMenu from "@ai-flags/components/layout/tree-menu.jsx";

const {
	errors: {
		NotFound
	},
	readTextFile
} = Deno;

const config = {
	routeOverride: "/entities/{:entityIdsString([Q0-9-/])}+"
};

const searchEntity = (entityTree, entityId) => {
	if (entityTree.children) {
		for (const [id, child] of Object.entries(entityTree.children)) {
			if (String(id) === String(entityId)) {
				return {
					id,
					...child
				};
			}

			const result = searchEntity(child, entityId);

			if (result) {
				return result;
			}
		}
	}

	return null;
};

const handler = {
	GET: async (request, context) => {
		const {
			params: {
				entityIdsString
			}
		} = context;

		const rootFolderPath = join("./");

		const staticFolderPath = join(rootFolderPath, "static");

		const entityTreeFilePath = join(staticFolderPath, "entity-tree.json");
		const entityTree = JSON.parse(await readTextFile(entityTreeFilePath));

		const entityIds = entityIdsString.split("/");

		const entityId = entityIds.at(-1);

		const entity = searchEntity(entityTree, entityId);

		const flagsObject = entity?.entities ?? {};

		const flags = await Promise.all(
			Object.entries(flagsObject).map(async ([id, flag]) => ({
				...flag,
				id,
				images: await Promise.all(flag.images.map(async (name) => {
					const params = new URLSearchParams({
						action: "query",
						iiprop: "url",
						prop: "imageinfo",
						titles: `File:${name}`,
						format: "json",
						origin: "*"
					});

					const url = `https://commons.wikimedia.org/w/api.php?${params.toString()}`;

					const {
						query: {
							pages,
							pages: {
								[Object.keys(pages)[0]]: {
									imageinfo: [
										{
											url: flagUrl
										}
									]
								}
							}
						}
					} = await (await fetch(url)).json();

					return flagUrl;
				}))
			}))
		);

		return context.render({
			entityTree,
			entityIds,
			entity,
			flags
		});
	}
};

/**
 *
 * @param props
 * @param props.data
 * @param props.data.entityTree
 * @param props.data.entityIds
 * @param props.data.entity
 * @param props.data.entity.name
 * @param props.data.entity.entities
 * @param props.data.flags
 */
const Entity = ({
	data: {
		entityTree, entityIds, entity: { name }, flags
	}
}) => {
	const [[earthEntityId, earthEntityObject]] = Object.entries(entityTree.children);

	const earthEntity = {
		id: earthEntityId,
		...earthEntityObject
	};

	return (
		<section className="p-4 md:p-16">
			<h2 className="h-24 text-mono">Entities</h2>
			<div className="flex flex-col md:flex-row gap-4">
				<TreeMenu rootEntity={earthEntity} href="/entities" className="w-full md:w-3/12" openIds={entityIds} />
				<div className="flex flex-col w-full p-4 rounded bg-neutral-800 md:w-9/12 gap-8">
					<h3 className="text-6xl scroll-mt-12 md:scroll-mt-96" id={name}>{name}</h3>
					{
						flags && (
							<ul className="grid grid-cols-cards gap-4">
								{
									flags.map(({
										id, name: flagName, images: [flagUrl]
									}) => (
										<li key={id} className="w-full h-48">
											<figure className="flex flex-col items-center justify-between w-full h-full p-2 border rounded gap-2 border-neutral-600 hover:bg-neutral-700">
												<div className="flex items-center justify-center w-full p-2 rounded h-36 bg-neutral-700">
													<img
														src={flagUrl}
														alt={flagName}
														className="max-w-full max-h-full border border-neutral-800"
														style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}
													/>
												</div>

												<figcaption className="flex items-center justify-center h-6 gap-2">
													<span className="text-sm">{flagName}</span>
													<span className="text-xs font-mono bg-neutral-700 px-1 py-0.5 rounded">({id})</span>
												</figcaption>
											</figure>
										</li>
									))
								}
							</ul>
						)
					}
				</div>
			</div>

		</section>
	);
};

export { config, handler };

export default Entity;
