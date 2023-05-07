import { Command } from "cliffy";

import { isCompletelyTransparent } from "@ai-flags/utilities";

const {
	args
} = Deno;

const { options: { input } } = await new Command()
	.name("is-completely-transparent")
	.version("0.1.0")
	.description("Check if an image is completely transparent")
	.option(
		"-i, --input <input:string>",
		"file path or url of PNG image",
		{ required: true }
	)
	.parse(args);

console.log(await isCompletelyTransparent(input));
