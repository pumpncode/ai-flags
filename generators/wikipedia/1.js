import "std/dotenv/load";

import { loopOverCountries } from "@ai-flags/utilities";
import { select } from "hast-util-select";
import { h } from "hastscript";
import rehypeParse from "rehype-parse";
import rehypeRemark from "rehype-remark";
import remarkGfm from "remark-gfm";
import remarkStringify from "remark-stringify";
import remarkUnlink from "remark-unlink";
import { fromFileUrl } from "std/path";
import { unified } from "unified";
import patches from "./patches.js";

const {
	cwd,
} = Deno;

const moduleFilePath = fromFileUrl(import.meta.url);

const setupName = moduleFilePath.replace(cwd(), "").replace(/^\/generators\//, "").replace(/\.js$/, "");

const generator = async ({ name, code }) => {
	let description;

	const wikipediaName = name.split(" ").join("_");

	if (patches.has(code) && patches.get(code).has("description")) {
		description = patches.get(code).get("description");
	}
	else {
		const htmlText = await (await fetch(`https://en.wikipedia.org/api/rest_v1/page/html/Flag_of_${wikipediaName}`)).text();

		description = String(
			await unified()
				.use(rehypeParse)
				.use(() => (tree) => {
					const bodyTree = select("body", tree);

					const ignoredSectionTitles = [
						"See also",
						"References",
						"External links",
						"Notes"
					];

					const newTree = {
						...bodyTree,
						children: [
							h("h1", `Flag of ${name}`),
							...bodyTree.children
								.filter((node) => {
									const sectionTitle = select("h2", node)?.children.find(({ type }) => type === "text")?.value;

									return !ignoredSectionTitles.includes(sectionTitle);
								})
								.map((node) => {
									return {
										...node,
										children: node.children.filter(({ tagName, properties, children }) => {
											if (tagName === "h2") {
												return !(children.length === 1 && children[0].value === "Description");
											}

											return (
												!(
													tagName == "h2" &&
													children.length === 1 &&
													children[0].value === "Description"
												) &&
												tagName !== "figure" &&
												(
													!properties?.className ||
													!properties?.className.some((className) => ["ambox", "infobox", "shortdescription"].includes(className))
												)
											);
										})
									}
								})
						]
					};

					return newTree;
				})
				.use(rehypeRemark)
				.use(remarkGfm)
				.use(remarkUnlink)
				.use(
					remarkStringify,
					{
						bullet: "-",
						listItemIndent: "one",
						handlers: {
							strong: (node) => {
								return node.children.map(({ value }) => value).join("");
							},
							emphasis: (node) => {
								if (node.children.map(({ value }) => value).join("") === "citation needed") {
									return "";
								}

								return `*${node.children.map(({ value }) => value).join("")}*`;
							},
							text: (node) => {
								return node.value.replace(/(?:\[\d+\]|citation needed|^\]|\[$)/g, "")
							}
						}
					}
				)
				.process(htmlText)
		);
	}

	let svg;

	if (patches.has(code) && patches.get(code).has("svg")) {
		svg = patches.get(code).get("svg");
	}
	else {
		const mediaList = await (await fetch(`https://en.wikipedia.org/api/rest_v1/page/media-list/Flag_of_${wikipediaName}`)).json();

		const svgTitle = mediaList.items.find(({ title }) => title.endsWith(".svg"))?.title;

		const svgInfo = await (await fetch(`https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&titles=${svgTitle}&redirects=1&formatversion=2&iiprop=url`)).json();

		const svgUrl = svgInfo.query.pages[0].imageinfo[0].url;

		svg = await (await fetch(svgUrl)).text();
	}

	return { description, svg };
}

await loopOverCountries(setupName, generator);