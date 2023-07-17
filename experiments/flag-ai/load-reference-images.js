import { join } from "std/path";
import { decode, Image } from "imagescript";

import {
	resizeHeight
} from "./constants.js";

const {
	cwd,
	readDir,
	readFile
} = Deno;

/**
 *
 * @param props
 * @param props.resizeHeight
 */
const loadReferenceImages = async () => {
	const referenceImagesFolderPath = join(cwd(), "data", "vexillologists", "wikipedia", "wikipedia", "1", "1");

	const referenceImages = [];

	console.info("Loading reference images...");

	for await (const { name: code, isDirectory: codeIsDirectory } of readDir(referenceImagesFolderPath)) {
		if (codeIsDirectory) {
			const codeFolderPath = join(referenceImagesFolderPath, code);

			const imageFilePath = join(codeFolderPath, "flag.png");

			const imageData = await readFile(imageFilePath);

			const image = await decode(imageData);

			const resizedImage = image.resize(Image.RESIZE_AUTO, resizeHeight);

			referenceImages.push({
				code,
				image: resizedImage
			});
		}
	}

	const collator = new Intl.Collator();

	const sortedReferenceImages = referenceImages.toSorted(({ code: codeA }, { code: codeB }) => collator.compare(codeA, codeB));

	return sortedReferenceImages;
};

export default loadReferenceImages;
