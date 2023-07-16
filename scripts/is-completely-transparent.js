import { Command } from "cliffy";
import { getFormat, getPixels } from "get_pixels";

const {
	args,
	errors: { NotFound },
	readFile
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

let preparedInput = input;

try {
	preparedInput = await readFile(input);

	if (getFormat(preparedInput) !== "png") {
		throw new Error("Input is not a PNG file.");
	}
}
catch (error) {
	if (!(error instanceof NotFound)) {
		throw error;
	}
}

const { data: pixels } = await getPixels(preparedInput);

const channels = 4;

for (let index = 3; index < pixels.length; index += channels) {
	if (pixels[index] !== 0) {
		return false;
	}
}

return true;

console.log(await isCompletelyTransparent(input));
