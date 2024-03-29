import DOMPurify from "dompurify";
import { useEffect, useState } from "preact/hooks";
import SVGPathCommander from "svg-path-commander";
import { optimize as optimizeSvg } from "svgo";

import { addZigzag, traverseSvg } from "@/utilities/client.js";

const svgoConfig = {
	multipass: true,
	js2svg: {
		pretty: true,
		indent: "\t"
	},
	plugins: [
		{
			name: "preset-default",
			params: {
				overrides: {
					removeViewBox: false,
					convertShapeToPath: {
						convertArcs: true
					},
					convertColors: {
						names2hex: false
					}
				}
			}
		}
	]
};

/**
 *
 */
const ZigzaggerIsland = () => {
	// <rect width="250" height="500" fill="black" />
	// <rect x="100" y="100" width="200" height="200" fill="black" />
	// <circle cx="300" cy="300" r="100" fill="red" />
	// <circle cx="150" cy="150" r="50" fill="green" />
	// <polygon points="300,50 400,100 350,200 250,75" fill="blue" />
	// <path d="M 0,250 L 500,250" fill="none" stroke="black" stroke-width="10" />
	// <rect width="250" height="500" fill="black" />
	// <rect width="500" height="500" fill="maroon" />
	// <rect width="100" height="500" fill="white" />
	const [svg, setSvg] = useState(
		`
		<circle cx="300" cy="300" r="100" fill="red" />
		<circle cx="150" cy="150" r="50" fill="green" />
		<polygon points="300,50 400,100 350,200 250,75" fill="blue" />
		<path d="M 0,250 L 500,250" fill="none" stroke="black" stroke-width="10" /> 
		`
			.trim()
			.replaceAll("\t", "")
	);

	const [oldSvg, setOldSvg] = useState(null);
	const [newSvg, setNewSvg] = useState(null);

	const [count, setCount] = useState(5);
	const [magnitude, setMagnitude] = useState(25);
	const [topActive, setTopActive] = useState(true);
	const [bottomActive, setBottomActive] = useState(true);
	const [leftActive, setLeftActive] = useState(true);
	const [rightActive, setRightActive] = useState(true);
	const [flip, setFlip] = useState(false);

	useEffect(() => {
		if (svg) {
			try {
				setOldSvg(
					DOMPurify.sanitize(
						svg,
						{
							USE_PROFILES: {
								svg: true,
								svgFilters: true
							},
							ADD_TAGS: [
								"path",
								"g",
								"circle",
								"rect",
								"polygon",
								"polyline",
								"line",
								"ellipse"
							],
							ADD_ATTR: [
								"d",
								"stroke",
								"stroke-width",
								"fill",
								"stroke-linecap",
								"stroke-linejoin",
								"stroke-dasharray",
								"stroke-dashoffset",
								"stroke-opacity",
								"fill-opacity",
								"transform",
								"cx",
								"cy",
								"r",
								"x",
								"y",
								"width",
								"height",
								"points",
								"x1",
								"y1",
								"x2",
								"y2",
								"rx",
								"ry"
							],
							NAMESPACE: "http://www.w3.org/2000/svg"
						}
					).replaceAll("xmlns=\"http://www.w3.org/2000/svg\"", "")
				);

				const { data: sanitizedSvg } = optimizeSvg(
					DOMPurify.sanitize(
						svg,
						{
							USE_PROFILES: {
								svg: true,
								svgFilters: true
							},
							ADD_TAGS: [
								"path",
								"g",
								"circle",
								"rect",
								"polygon",
								"polyline",
								"line",
								"ellipse"
							],
							ADD_ATTR: [
								"d",
								"stroke",
								"stroke-width",
								"fill",
								"stroke-linecap",
								"stroke-linejoin",
								"stroke-dasharray",
								"stroke-dashoffset",
								"stroke-opacity",
								"fill-opacity",
								"transform",
								"cx",
								"cy",
								"r",
								"x",
								"y",
								"width",
								"height",
								"points",
								"x1",
								"y1",
								"x2",
								"y2",
								"rx",
								"ry"
							],
							NAMESPACE: "http://www.w3.org/2000/svg"
						}
					).replaceAll("xmlns=\"http://www.w3.org/2000/svg\"", ""),
					svgoConfig
				);

				const zigzaggedSvg = traverseSvg(
					`<svg>${sanitizedSvg}</svg>`,
					(element) => {
						if (element.tagName === "path" && element.hasAttribute("d")) {
							const path = new SVGPathCommander(element.getAttribute("d"), { round: "off" }).toCurve();

							const zigzaggedPath = addZigzag(path, {
								count,
								magnitude,
								flip,
								topActive,
								bottomActive,
								leftActive,
								rightActive
							});

							element.setAttribute("d", zigzaggedPath.toString());
						}
					}
				)
					.replace(/^<svg>/, "")
					.replace(/<\/svg>$/, "");

				const { data: sanitizedZigzaggedSvg } = optimizeSvg(
					zigzaggedSvg,
					svgoConfig
				);

				setNewSvg(sanitizedZigzaggedSvg);
			}
			catch (error) {
				// console.error(error);
			}
		}
	}, [
		svg,
		count,
		magnitude,
		flip,
		topActive,
		bottomActive,
		leftActive,
		rightActive
	]);

	return (
		<>
			<div className="relative flex items-center justify-center w-full gap-8 p-8 rounded bg-neutral-700">
				<div className="relative flex items-center justify-center w-full h-full">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 500 500"
						className="h-full border border-neutral-800"
						style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}
						dangerouslySetInnerHTML={{ __html: newSvg }}
					/>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 500 500"
						className="absolute h-full opacity-0 hover:opacity-50"
						dangerouslySetInnerHTML={{ __html: oldSvg }}
					/>
				</div>

				<div className="flex flex-col gap-4">
					<div className="grid grid-cols-3 gap-2">
						<label for="count">Count:</label>
						<input id="count" type="range" min="0" max="20" value={count} onInput={({ target: { value } }) => setCount(value)} />
						{count}
					</div>
					<div className="grid grid-cols-3 gap-2">
						<label for="magnitude">Magnitude:</label>
						<input id="magnitude" type="range" min="-200" max="200" value={magnitude} onInput={({ target: { value } }) => setMagnitude(value)} />
						{magnitude}
					</div>
					<div className="grid grid-cols-3 gap-2">
						<label for="flip">Flip:</label>
						<input id="flip" type="checkbox" checked={flip} onInput={({ target: { checked } }) => setFlip(checked)} />
					</div>
					<div className="grid items-center grid-cols-3 gap-2">
						<label>Position:</label>
						<div className="flex flex-col items-center col-span-2 gap-2">
							<div className="flex gap-1">
								<label for="topActive">Top:</label>
								<input id="topActive" type="checkbox" checked={topActive} onInput={({ target: { checked } }) => setTopActive(checked)} />
							</div>
							<div className="flex self-stretch justify-between">
								<div className="flex gap-1">
									<label for="leftActive">Left:</label>
									<input id="leftActive" type="checkbox" checked={leftActive} onInput={({ target: { checked } }) => setLeftActive(checked)} />
								</div>
								<div className="flex gap-1">
									<label for="rightActive">Right:</label>
									<input id="rightActive" type="checkbox" checked={rightActive} onInput={({ target: { checked } }) => setRightActive(checked)} />
								</div>
							</div>
							<div className="flex gap-1">
								<label for="bottomActive">Bottom:</label>
								<input id="bottomActive" type="checkbox" checked={bottomActive} onInput={({ target: { checked } }) => setBottomActive(checked)} />
							</div>
						</div>
					</div>
				</div>

			</div>

			<div className="flex flex-col w-full h-full gap-2 p-2 rounded bg-neutral-700">
				<textarea className="w-full h-full p-4 font-mono rounded resize-none bg-neutral-800" value={svg} onInput={({ target: { value } }) => setSvg(value)} />
				<textarea className="w-full h-full p-4 font-mono rounded resize-none bg-neutral-800" readonly value={newSvg} />
			</div>
		</>
	);
};

export default ZigzaggerIsland;
