import { add, bignumber, compare, divide, multiply, subtract, sum } from "mathjs";
import SVGPathCommander from "svg-path-commander";
import Bezier from "./bezier.js";

const addZigzag = (path, { count: countOfPeaks, amplitude }) => {
	const {
		segments
	} = path;

	const bignumberCountOfPeaks = bignumber(countOfPeaks);
	const bignumberAmplitude = bignumber(amplitude);

	const [[, originX, originY], ...curveCommands] = segments.map((segment) => segment.map((value) => typeof value === "number" ? bignumber(value) : value));

	let curves = curveCommands.map(([letter, ...curveCommandNumbers], index, array) => {
		const pointBefore = array[index - 1] ? { x: array[index - 1][5], y: array[index - 1][6] } : { x: originX, y: originY };

		return new Bezier(
			pointBefore,
			...curveCommandNumbers.reduce((accumulator, currentValue, currentIndex) => {
				if (currentIndex % 2 === 0) {
					accumulator.push({ x: currentValue });
				}
				else {
					accumulator[accumulator.length - 1].y = currentValue;
				}

				return accumulator;
			}, [])
		);
	});

	console.log("curves");
	console.log(curves);

	// for (let splitIndex = 0; splitIndex < 5; splitIndex++) {
	// 	curves = curves
	// 		.map((curve) => {
	// 			const { left: curveA, right: curveB } = curve.split(0.5);

	// 			return [curveA, curveB];
	// 		})
	// 		.flat()
	// }

	const totalLength = sum(curves.map((curve) => bignumber(curve.length())));

	const normalizedTotalLength = 1;

	const numberOfParts = multiply(bignumberCountOfPeaks, bignumber(2));

	const curveInfos = curves
		.map((curve, index, array) => {
			const curveLength = bignumber(curve.length());
			const normalizedCurveLength = divide(curveLength, totalLength);
			const accumulativeCurveLength = sum(array.slice(0, index + 1).map((curve) => bignumber(curve.length())));
			const normalizedAccumulativeCurveLength = divide(accumulativeCurveLength, totalLength);

			const curveStart = subtract(accumulativeCurveLength, curveLength);
			const normalizedCurveStart = divide(curveStart, totalLength);
			const curveEnd = accumulativeCurveLength;
			const normalizedCurveEnd = divide(curveEnd, totalLength);

			return {
				curve,
				index,
				curveLength,
				normalizedCurveLength,
				accumulativeCurveLength,
				normalizedAccumulativeCurveLength,
				curveStart,
				normalizedCurveStart,
				curveEnd,
				normalizedCurveEnd
			}
		});

	console.log(curveInfos.length);

	const polygonPoints = [];

	for (let partNumber = bignumber(1); compare(partNumber, numberOfParts) <= 0; partNumber = add(partNumber, bignumber(1))) {
		const normalizedPartLength = divide(normalizedTotalLength, numberOfParts);

		const currentPartStart = multiply(normalizedPartLength, subtract(partNumber, bignumber(1)));
		const currentPartEnd = multiply(normalizedPartLength, partNumber);
		const currentPartMidpointNumber = divide(add(currentPartStart, currentPartEnd), 2);

		const { normalizedCurveStart: currentNormalizedCurveStart, normalizedCurveEnd: currentNormalizedCurveEnd, curve: currentCurve } = curveInfos
			.find(({ normalizedCurveStart, normalizedCurveEnd }) => currentPartMidpointNumber >= normalizedCurveStart && currentPartMidpointNumber <= normalizedCurveEnd);

		const zigzagPointNumber = divide(
			subtract(currentPartMidpointNumber, currentNormalizedCurveStart),
			subtract(currentNormalizedCurveEnd, currentNormalizedCurveStart)
		);

		const { x: zigzagPointX, y: zigzagPointY } = currentCurve.get(zigzagPointNumber);
		const { x: zigzagPointNormalX, y: zigzagPointNormalY } = currentCurve.normal(zigzagPointNumber);

		if (partNumber % 2 === 0) {
			const peakPoint = {
				x: add(bignumber(zigzagPointX), multiply(bignumberAmplitude, bignumber(zigzagPointNormalX))),
				y: add(bignumber(zigzagPointY), multiply(bignumberAmplitude, bignumber(zigzagPointNormalY)))
			};

			polygonPoints.push(peakPoint);
		}
		else {
			const troughPoint = {
				x: subtract(bignumber(zigzagPointX), bignumber(zigzagPointNormalX)),
				y: subtract(bignumber(zigzagPointY), bignumber(zigzagPointNormalY))
			};
			polygonPoints.push(troughPoint);
		}
	}

	const newPath = new SVGPathCommander(
		[
			...polygonPoints.map(({ x, y }, index) => [index === 0 ? "M" : "L", Number(x), Number(y)]),
		],
		{ round: "off" }
	);

	return newPath;
};

export default addZigzag;