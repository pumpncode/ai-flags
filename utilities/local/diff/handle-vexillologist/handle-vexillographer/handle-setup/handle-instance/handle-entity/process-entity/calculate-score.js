/* eslint-disable max-statements */

import { decode, Image } from "npm:imagescript";
import pixelmatch from "npm:pixelmatch";

import saveImage from "./calculate-score/save-image.js";

import roundToDecimalPlaces from "@/utilities/shared/round-to-decimal-places.js";

const {
	readFile
} = Deno;

/**
 *
 * @param options
 * @param options.testFilePath
 * @param options.referenceFilePath
 * @param options.diffFilePath
 */
const calculateScore = async ({
	testFilePath,
	referenceFilePath,
	diffFilePath
}) => {
	const testData = await readFile(testFilePath);

	const referenceData = await readFile(referenceFilePath);

	const {
		bitmap: referencePixels,
		width: referenceWidth,
		height: referenceHeight
	} = await decode(referenceData);

	let testImage = await decode(testData);

	const {
		width: testWidth,
		height: testHeight
	} = testImage;

	if (testWidth !== referenceWidth || testHeight !== referenceHeight) {
		testImage = testImage.fit(referenceWidth, referenceHeight);
	}

	const {
		bitmap: testPixels
	} = testImage;

	const width = referenceWidth;
	const height = referenceHeight;
	const channels = 4;
	const totalNumberOfPixels = width * height;
	const dataSize = totalNumberOfPixels * channels;

	const diffPixels = new Uint8ClampedArray(dataSize);

	const numberOfDifferentPixels = pixelmatch(
		testPixels,
		referencePixels,
		diffPixels,
		width,
		height,
		{
			diffMask: true,
			threshold: 0,
			diffColor: [
				0,
				0,
				0
			]
		}
	);

	const difference = numberOfDifferentPixels / totalNumberOfPixels;

	const score = roundToDecimalPlaces(1 - difference, 3);

	const outputImage = new Image(width, height);

	outputImage.bitmap = diffPixels;

	saveImage(diffFilePath, outputImage);

	return score;
};

export default calculateScore;
