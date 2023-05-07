import postcss from "npm:postcss@8.4.22";
import tailwindcss from "npm:tailwindcss@3.3.1";

const {
	readTextFile,
	writeTextFile
} = Deno;

const FROM = "./tailwind.css";
const TO = "./static/style/tailwind.css";

const DEFAULT_OPTIONS = {
	content: [
		"./routes/**/*.jsx",
		"./components/**/*.jsx",
		"./islands/**/*.jsx"
	],
	theme: {}
};
const DEFAULT_TAILWIND_CSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

/**
 *
 * @param partialConfig
 */
const dev = async (
	partialConfig = DEFAULT_OPTIONS
) => {
	const config = {
		...DEFAULT_OPTIONS,
		...partialConfig
	};

	const processor = postcss([
		tailwindcss(config)
		// autoprefixer(),
		// cssnano({ preset: ["default", { cssDeclarationSorter: false }] })
	]);

	const css = await readTextFile(FROM).catch(() => DEFAULT_TAILWIND_CSS);
	const content = await processor.process(css, {
		from: FROM,
		to: TO
	});

	await writeTextFile(TO, content.css);
};

export default dev;
