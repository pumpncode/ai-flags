import { Bezier } from "bezier-js";
import { sum } from "lodash-es";
import SVGPathCommander from "svg-path-commander";

import areColinear from "./add-zigzag/are-colinear.js";
import roundToDecimalPlaces from "@/utilities/shared/round-to-decimal-places.js";

/**
 *
 * @param path
 * @param options
 * @param options.count
 * @param options.magnitude
 * @param options.flip
 * @param options.topActive
 * @param options.bottomActive
 * @param options.leftActive
 * @param options.rightActive
 */
const addZigzag = (
	path,
	{
		count: countOfPeaks,
		magnitude,
		flip,
		topActive,
		bottomActive,
		leftActive,
		rightActive
	}
) => {
	const {
		segments
	} = path;

	const [
		[
			,
			originX,
			originY
		],
		...curveCommands
	] = segments;

	const curves = curveCommands
		.map(([letter, ...curveCommandNumbers], index, array) => {
			const pointBefore = array[index - 1]
				? {
					x: array[index - 1][5],
					y: array[index - 1][6]
				}
				: {
					x: originX,
					y: originY
				};

			const pointsAfter = curveCommandNumbers.reduce((accumulator, currentValue, currentIndex) => {
				if (currentIndex % 2 === 0) {
					accumulator.push({ x: currentValue });
				}
				else {
					accumulator[accumulator.length - 1].y = currentValue;
				}

				return accumulator;
			}, []);

			let points = [pointBefore, ...pointsAfter];

			if (areColinear(...points)) {
				const [
					startPoint,
					controlPointA,
					controlPointB,
					endPoint
				] = points;

				points = [
					startPoint,
					{
						x: roundToDecimalPlaces((1 / 3) * (endPoint.x - startPoint.x) + startPoint.x, 3),
						y: roundToDecimalPlaces((1 / 3) * (endPoint.y - startPoint.y) + startPoint.y, 3)
					},
					{
						x: roundToDecimalPlaces((2 / 3) * (endPoint.x - startPoint.x) + startPoint.x, 3),
						y: roundToDecimalPlaces((2 / 3) * (endPoint.y - startPoint.y) + startPoint.y, 3)
					},
					endPoint
				];
			}

			return new Bezier(...points);
		});

	const totalLength = sum(curves.map((curve) => roundToDecimalPlaces(curve.length(), 3)));

	const normalizedTotalLength = 1;

	const numberOfParts = countOfPeaks * 2;

	const curveInfos = curves
		.map((curve, index, array) => {
			const curveLength = roundToDecimalPlaces(curve.length(), 3);
			const normalizedCurveLength = curveLength / totalLength;
			const accumulativeCurveLength = sum(array.slice(0, index + 1).map((curve) => roundToDecimalPlaces(curve.length(), 3)));
			const normalizedAccumulativeCurveLength = accumulativeCurveLength / totalLength;

			const curveStart = accumulativeCurveLength - curveLength;
			const normalizedCurveStart = curveStart / totalLength;
			const curveEnd = accumulativeCurveLength;
			const normalizedCurveEnd = curveEnd / totalLength;

			return {
				accumulativeCurveLength,
				curve,
				curveEnd,
				curveLength,
				curveStart,
				index,
				normalizedAccumulativeCurveLength,
				normalizedCurveEnd,
				normalizedCurveLength,
				normalizedCurveStart
			};
		});

	const polygonPoints = [];
	const flattenedCurveIndexes = [];

	for (let partNumber = 1; partNumber <= numberOfParts; partNumber++) {
		const normalizedPartLength = roundToDecimalPlaces(normalizedTotalLength / numberOfParts, 3);

		const currentPartStart = roundToDecimalPlaces(normalizedPartLength * (partNumber - 1), 3);
		const currentPartEnd = roundToDecimalPlaces(normalizedPartLength * partNumber, 3);
		const currentPartMidpointNumber = roundToDecimalPlaces((currentPartStart + currentPartEnd) / 2, 3);

		const {
			normalizedCurveStart: currentNormalizedCurveStart, normalizedCurveEnd: currentNormalizedCurveEnd, curve: currentCurve, index
		} = curveInfos
			.find(({ normalizedCurveStart, normalizedCurveEnd }) => currentPartMidpointNumber >= normalizedCurveStart && currentPartMidpointNumber <= normalizedCurveEnd);

		const { x, y } = currentCurve.normal(0.5);

		if (
			(!topActive && y > x && y > 0) ||
			(!bottomActive && y < x && y < 0) ||
			(!leftActive && x > y && x > 0) ||
			(!rightActive && x < y && x < 0)
		) {
			if (!flattenedCurveIndexes.includes(index)) {
				console.log("new curve");
				flattenedCurveIndexes.push(index);

				polygonPoints.push(currentCurve.get(0));
				polygonPoints.push(currentCurve.get(1));
			}

			continue;
		}

		const startPointNumber = (currentPartStart - currentNormalizedCurveStart) / (currentNormalizedCurveEnd - currentNormalizedCurveStart);
		const startPoint = currentCurve.get(startPointNumber);
		const startPointNormal = currentCurve.normal(startPointNumber);

		const endPointNumber = (currentPartEnd - currentNormalizedCurveStart) / (currentNormalizedCurveEnd - currentNormalizedCurveStart);
		const endPoint = currentCurve.get(endPointNumber);
		const endPointNormal = currentCurve.normal(endPointNumber);

		const zigzagPointNumber = (currentPartMidpointNumber - currentNormalizedCurveStart) / (currentNormalizedCurveEnd - currentNormalizedCurveStart);
		const zigzagPoint = currentCurve.get(zigzagPointNumber);
		const zigzagPointNormal = currentCurve.normal(zigzagPointNumber);

		if (flip) {
			const peakPoint1 = {
				x: startPoint.x - startPointNormal.x,
				y: startPoint.y - startPointNormal.y
			};

			polygonPoints.push(peakPoint1);

			const troughPoint = {
				x: zigzagPoint.x - (magnitude * zigzagPointNormal.x),
				y: zigzagPoint.y - (magnitude * zigzagPointNormal.y)
			};

			polygonPoints.push(troughPoint);

			const peakPoint2 = {
				x: endPoint.x - endPointNormal.x,
				y: endPoint.y - endPointNormal.y
			};

			polygonPoints.push(peakPoint2);
		}
		else {
			const peakPoint1 = {
				x: startPoint.x - (magnitude * startPointNormal.x),
				y: startPoint.y - (magnitude * startPointNormal.y)
			};

			polygonPoints.push(peakPoint1);

			const troughPoint = {
				x: zigzagPoint.x - zigzagPointNormal.x,
				y: zigzagPoint.y - zigzagPointNormal.y
			};

			polygonPoints.push(troughPoint);

			const peakPoint2 = {
				x: endPoint.x - (magnitude * endPointNormal.x),
				y: endPoint.y - (magnitude * endPointNormal.y)
			};

			polygonPoints.push(peakPoint2);
		}
	}

	const newPath = new SVGPathCommander([
		...polygonPoints.map(({ x, y }, index) => [
			index === 0 ? "M" : "L",
			x,
			y
		])
	]);

	return newPath;
};

export default addZigzag;
