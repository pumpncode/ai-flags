import { decode } from "imagescript";
import { nanoid } from "npm:nanoid";
import { join } from "std/path";
import pixelmatch from "npm:pixelmatch";

import {
	inputAlphabet,
	inputLength,
	outputMaxLength,
	outputAlphabet,
	mutationRange,
	mutationProbability,
	resizeHeight
} from "./constants.js";
import getRandomInteger from "./get-random-integer.js";
import probability from "./probability.js";

import svgToPng from "@/utilities/svg-to-png.js";

const {
	cwd,
	readFile,
	remove,
	writeTextFile
} = Deno;

globalThis.highscore = 0;

const svgPrefix = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${resizeHeight} ${resizeHeight}">`;
const svgSuffix = "</svg>";

/**
 *
 */
const Vexillographer = class {

	score = 0;

	renderSuccess = false;

	lastInput = Array(inputLength).fill(inputAlphabet[0]).join("");

	dna = Array(inputLength)
		.fill()
		.map(() => (
			Array(Math.floor(inputAlphabet.length / 3))
				.fill()
				.map(() => (
					Array(Math.floor(outputMaxLength / 3))
						.fill()
						.map(() => [
							0,
							0,
							0
						])
				))
		));

	static mutateSingleValue = (value, mod) => (
		probability(mutationProbability)
			? Math.abs((value + getRandomInteger(-(mutationRange * 2), (mutationRange * 2))) % mod)
			: value
	);

	/**
	 *
	 */
	mutate = () => {
		const {
			dna,
			lastInput
		} = this;

		const lastInputCharacterIndexes = lastInput.split("").map((character) => inputAlphabet.indexOf(character));

		const newDna = dna
			.map((inputCharacterArray, inputCharacterArrayIndex) => (
				inputCharacterArray
					.map((outputArray, outputArrayIndex) => (
						lastInputCharacterIndexes[inputCharacterArrayIndex] === outputArrayIndex
							? outputArray
								.map(([
									characterIndex,
									active,
									offset
								]) => (
									[
										Vexillographer.mutateSingleValue(characterIndex, outputAlphabet.length),
										Vexillographer.mutateSingleValue(active, 2),
										getRandomInteger(-3, 3)
									]
								))
							: outputArray
					))
			));

		this.dna = newDna;
	};

	generateOutput = () => {
		const {
			dna,
			input
		} = this;

		this.lastInput = input;

		const output = Array(outputMaxLength).fill(0);

		for (const [inputIndex, inputCharacter] of Object.entries(input.split(""))) {
			const inputArray = dna[inputIndex][Math.floor(inputAlphabet.indexOf(inputCharacter) / 3)];

			for (const [
				outputIndex,
				[
					characterIndex,
					active,
					offset
				]
			] of Object.entries(inputArray)) {
				if (active) {
					const actualIndex = Math.max(0, outputIndex + offset);

					output[actualIndex] = characterIndex;
				}
			}
		}

		const outputString = output.map((characterIndex) => outputAlphabet[characterIndex]).join("");

		return `${svgPrefix}${outputString}${svgSuffix}`;
	};

	renderPng = async () => {
		const svg = this.generateOutput();

		await writeTextFile(this.tempSvgFilePath, svg);

		try {
			await svgToPng(
				this.tempSvgFilePath,
				this.tempPngFilePath,
				{
					resizeHeight
				}
			);

			this.renderSuccess = true;
		}
		catch (error) {
			this.renderSuccess = false;
		}
	};

	// eslint-disable-next-line max-statements
	calculateScore = async (input) => {
		this.input = input;
		this.lastInput = input;

		this.tempSvgFilePath = join(cwd(), "temp", `${nanoid()}.svg`);

		this.tempPngFilePath = this.tempSvgFilePath.replace(/\.svg$/u, ".png");

		await this.renderPng();

		if (this.renderSuccess) {
			const testData = await readFile(this.tempPngFilePath);
			const referenceFlagFilePath = join(cwd(), "experiments", "flag-ai", `reference${resizeHeight}px.png`);

			const referenceData = await readFile(referenceFlagFilePath);

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
			const totalNumberOfPixels = width * height;

			const numberOfDifferentPixels = pixelmatch(
				testPixels,
				referencePixels,
				null,
				width,
				height,
				{
					threshold: 0.2
				}
			);

			const difference = numberOfDifferentPixels / totalNumberOfPixels;

			this.score = Math.round((1 - difference) * 1000) / 1000;

			if (this.score <= globalThis.highscore) {
				remove(this.tempPngFilePath);
			}
			else {
				globalThis.highscore = this.score;
			}
		}
		else {
			this.score = 0;
		}

		remove(this.tempSvgFilePath);
	};

	clone = () => {
		const {
			score,
			dna,
			input,
			lastInput,
			renderSuccess
		} = this;

		const newVexillographer = new Vexillographer();

		Object.assign(
			newVexillographer,
			{
				score,
				dna,
				input,
				lastInput,
				renderSuccess
			}
		);

		return newVexillographer;
	};

	/**
	 *
	 */
	constructor() {

	}

};

export default Vexillographer;
