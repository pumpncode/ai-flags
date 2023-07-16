import WBK from "wikibase-sdk";

import "std/dotenv/load";
import { join } from "std/path";

import { lossy as jsonReplacerLossy } from "./generate-entities/json-replacer.js";

const {
	cwd,
	env,
	writeTextFile
} = Deno;

const cache = await caches.open("ai-flags");

const wbk = WBK({
	instance: "https://www.wikidata.org",
	sparqlEndpoint: "https://query.wikidata.org/sparql"
});

const queryUrls = [
	`?item wdt:P1001 ?jurisdiction.
	?jurisdiction rdfs:label ?jurisdictionLabel.
	FILTER((LANG(?jurisdictionLabel)) = "en")`,
	"FILTER NOT EXISTS {?item wdt:P1001 ?o}"
]
	.map((jurisdictionQueryPart) => wbk.sparqlQuery(`
	SELECT DISTINCT ?id WHERE {
		BIND(STRAFTER(STR(?item), "http://www.wikidata.org/entity/") AS ?id)
		BIND(xsd:integer(STRAFTER(STR(?item), "http://www.wikidata.org/entity/Q")) AS ?number)
		{
			SELECT * WHERE {
				?item p:P18 ?image.
				?image ps:P18 _:anyValueP18.
				${jurisdictionQueryPart}
				{
					?item p:P31 ?statement1.
					?statement1 (ps:P31/(wdt:P279*)) wd:Q69506823.
				}
				UNION
				{
					?item p:P279 ?statement2.
					?statement2 (ps:P279/(wdt:P279*)) wd:Q69506823.
				}
			}
		}
		SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
	}
	ORDER BY (?number)
`));

const entityIds = [];

for (const queryUrl of queryUrls) {
	const queryRequest = new Request(
		queryUrl,
		{
			headers: new Headers({
				"user-agent": "ai-flags bot (nanomiratus@gmail.com)"
			})
		}
	);

	let queryResponse = await cache.match(queryRequest);

	if (!queryResponse) {
		queryResponse = await fetch(queryRequest);

		await cache.put(queryRequest, queryResponse.clone());
	}

	const { results: { bindings } } = await queryResponse.json();

	entityIds.push(...bindings.map(({ id: { value } }) => value));
}

const entitiesUrls = wbk.getManyEntities({
	ids: entityIds,
	languages: "en"
});

const entitiesMap = new Map();

for (const entityUrl of entitiesUrls) {
	const entitiesRequest = new Request(
		entityUrl,
		{
			headers: new Headers({
				"user-agent": "ai-flags bot (nanomiratus@gmail.com)"
			})
		}
	);

	let entitiesResponse = await cache.match(entitiesRequest);

	if (!entitiesResponse) {
		entitiesResponse = await fetch(
			entityUrl,
			{
				headers: new Headers({
					"user-agent": "ai-flags bot (nanomiratus@gmail.com)"
				})
			}
		);

		await cache.put(entitiesRequest, entitiesResponse.clone());
	}

	const { entities } = await entitiesResponse.json();

	const filteredEntitiesEntries = Object.entries(entities)
		.filter(([id, entity]) => entity?.sitelinks?.enwiki?.title);

	for (const [id, entity] of filteredEntitiesEntries) {
		console.log(id);
		const {
			labels: {
				en: {
					value: name
				}
			},
			claims: {
				P18: imageClaims,
				P1001: jurisdictionClaims
			},
			sitelinks: {
				enwiki: {
					title
				}
			}
		} = entity;

		const images = new Set(
			[...imageClaims]
				.filter(({ mainsnak: { snaktype } }) => snaktype === "value")
				.sort(({ rank }) => (rank === "preferred" ? -1 : 1))
				.map(({ mainsnak: { datavalue: { value: image } } }) => image)
				.filter((image) => image.endsWith(".svg"))
		);

		if (images.size === 0) {
			continue;
		}

		const jurisdictionIds = new Set(
			jurisdictionClaims
				? [...jurisdictionClaims]
					.filter(({ mainsnak: { snaktype } }) => snaktype === "value")
					.sort(({ rank }) => (rank === "preferred" ? -1 : 1))
					.map(({ mainsnak: { datavalue: { value: { id: jurisdiction } } } }) => jurisdiction)
				: []
		);

		const jurisdictions = new Set();

		for (const jurisdictionId of jurisdictionIds) {
			const jurisdictionUrl = wbk.getEntities({
				ids: jurisdictionId,
				languages: "en"
			});

			const jurisdictionRequest = new Request(
				jurisdictionUrl,
				{
					headers: new Headers({
						"user-agent": "ai-flags bot (nanomiratus@gmail.com)"
					})
				}
			);

			let jurisdictionResponse = await cache.match(jurisdictionRequest);

			if (!jurisdictionResponse) {
				jurisdictionResponse = await fetch(jurisdictionRequest);

				await cache.put(jurisdictionRequest, jurisdictionResponse.clone());
			}

			const { entities: { [jurisdictionId]: jurisdiction } } = await jurisdictionResponse.json();

			const {
				labels: {
					en: {
						value: jurisdictionName
					}
				},
				claims: {
					P1566: geoNamesClaims
				}
			} = jurisdiction;

			const geoNamesIds = new Set(
				geoNamesClaims
					? [...geoNamesClaims]
						.filter(({ mainsnak: { snaktype } }) => snaktype === "value")
						.sort(({ rank }) => (rank === "preferred" ? -1 : 1))
						.map(({ mainsnak: { datavalue: { value: geoNamesId } } }) => geoNamesId)
					: []
			);

			jurisdictions.add(new Map(Object.entries({
				id: jurisdictionId,
				name: jurisdictionName,
				geoNamesIds
			})));
		}

		entitiesMap.set(
			id,
			new Map(Object.entries({
				name,
				title,
				images,
				jurisdictions
			}))
		);
	}
}

const entitiesTree = new Map(Object.entries({
	children: new Map(),
	entities: new Map()
}));

const geoNamesEndpoint = new URL("https://secure.geonames.org/hierarchyJSON");

const historicalFeatureCodes = new Set([
	"ADM1H",
	"ADM2H",
	"ADM3H",
	"ADM4H",
	"ADM5H",
	"ADMDH",
	"PCLH",
	"RGNH",
	"PPLCH",
	"PPLH"
]);

for (const [id, entity] of entitiesMap) {
	console.log(id);
	const jurisdictions = entity.get("jurisdictions");

	if (jurisdictions.size > 0) {
		for (const jurisdiction of jurisdictions) {
			const geoNamesIds = jurisdiction.get("geoNamesIds");
			const jurisdictionId = jurisdiction.get("id");
			const jurisdictionName = jurisdiction.get("name");

			if (geoNamesIds.size > 0) {
				for (const geoNamesId of geoNamesIds) {
					try {
						const geoNamesUrl = new URL(geoNamesEndpoint);

						geoNamesUrl.searchParams.set("geonameId", geoNamesId);
						geoNamesUrl.searchParams.set("username", env.get("GEONAMES_USERNAME"));

						let geoNamesResponse = await cache.match(geoNamesUrl);

						if (!geoNamesResponse) {
							geoNamesResponse = await fetch(geoNamesUrl);

							await cache.put(geoNamesUrl, geoNamesResponse.clone());
						}

						const geoNamesObject = await geoNamesResponse.json();

						const { geonames: hierarchy } = geoNamesObject;

						let currentNode = entitiesTree.get("children");

						for (const [
							index,
							{
								geonameId: geoNameId, name, fcode: featureCode
							}
						] of hierarchy.entries()) {
							if (index === 0) {
								if (!currentNode.has(geoNameId)) {
									currentNode.set(geoNameId, new Map(Object.entries({ name })));
								}

								currentNode = currentNode.get(geoNameId);
							}
							else {
								const parentGeoNameId = hierarchy[index - 1].geonameId;

								if (!currentNode.has("children")) {
									currentNode.set("children", new Map());
								}

								if (!currentNode.get("children").has(geoNameId)) {
									currentNode.get("children").set(geoNameId, new Map(Object.entries({ name })));
								}

								currentNode = currentNode.get("children").get(geoNameId);

								if (index === hierarchy.length - 1) {
									if (!currentNode.has("entities")) {
										currentNode.set("entities", new Map());
									}

									if (!currentNode.has("id")) {
										currentNode.set("id", jurisdictionId);
									}

									currentNode.get("entities").set(
										id,
										new Map(Object.entries({
											name: entity.get("title"),
											images: entity.get("images"),
											jurisdictionId,
											jurisdictionName,
											historical: historicalFeatureCodes.has(featureCode),
											geographical: true,
											locationFound: true
										}))
									);
								}
							}
						}
					}
					catch (error) {
						console.error(error);
					}
				}
			}
			else if (!entitiesTree.get("entities").has(id)) {
				entitiesTree.get("entities").set(
					id,
					new Map(Object.entries({
						name: entity.get("name"),
						title: entity.get("title"),
						images: entity.get("images"),
						jurisdictionId,
						jurisdictionName,
						historical: null,
						geographical: true,
						locationFound: false
					}))
				);
			}
		}
	}
	else if (!entitiesTree.get("entities").has(id)) {
		entitiesTree.get("entities").set(
			id,
			new Map(Object.entries({
				name: entity.get("name"),
				title: entity.get("title"),
				images: entity.get("images"),
				jurisdictionId: null,
				jurisdictionName: null,
				historical: null,
				geographical: false,
				locationFound: null
			}))
		);
	}
}

const staticFolderPath = join(cwd(), "static");

const entitiesFilePath = join(staticFolderPath, "entities.json");

const entitiesTreeFilePath = join(staticFolderPath, "entity-tree.json");

await writeTextFile(entitiesFilePath, JSON.stringify(entitiesMap, jsonReplacerLossy));

await writeTextFile(entitiesTreeFilePath, JSON.stringify(entitiesTree, jsonReplacerLossy));
