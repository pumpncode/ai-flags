import { getFormat, getPixels } from "get_pixels";

const {
	errors: { NotFound },
	readFile
} = Deno;

/**
 *
 * @param input
 */
const isCompletelyTransparent = async (input) => {
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
};

export default isCompletelyTransparent;
