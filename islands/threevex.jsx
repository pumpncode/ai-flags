import {
	useEffect, useState, useRef
} from "preact/hooks";
import { optimize as optimizeSvg } from "svgo";
import {
	TbArrowRight,
	TbArrowDown,
	TbArrowUpRight,
	TbMenuOrder,
	TbArrowsRightDown,
	TbChevronDown,
	TbHash,
	TbPalette
} from "react-icons/tb";
import { capitalize } from "lodash-es";

import { threevex } from "@/utilities/client.js";

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
					convertShapeToPath: false,
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
// eslint-disable-next-line max-lines-per-function
const SvgdTranspilerIsland = () => {
	const svgRef = useRef(null);
	const [width, setWidth] = useState(6);
	const [height, setHeight] = useState(3);
	const [depth, setDepth] = useState(2);
	const [numberOfStripes, setNumberOfStripes] = useState(3);
	const [direction, setDirection] = useState("horizontal");
	const [stripes, setStripes] = useState([
		{
			color: "#ff0000"
		},
		{
			color: "#ffffff"
		},
		{
			color: "#0000ff"
		}
	]);

	const [newSvg, setNewSvg] = useState(null);

	const handleColorChange = (event, index) => {
		setStripes((previousStripes) => {
			const newStripes = [...previousStripes];

			newStripes[index] = {
				...newStripes[index],
				color: event.target.value
			};

			return newStripes;
		});
	};

	useEffect(() => {
		setStripes((previousStripes) => {
			const newStripes = [
				...previousStripes.slice(0, Number(numberOfStripes)),
				...Array(Number(numberOfStripes) - previousStripes.length)
					.fill()
					.map(() => ({
						color: "#000000"
					}))
			];

			return newStripes;
		});
	}, [numberOfStripes]);

	useEffect(
		() => {
			const svg = threevex({
				width: Number(width),
				height: Number(height),
				depth: Number(depth),
				stripes: stripes.slice(0, Number(numberOfStripes)),
				direction,
				svgElement: svgRef.current
			});

			const { data: optimizedSvg } = optimizeSvg(svg, svgoConfig);

			setNewSvg(optimizedSvg);
		},
		[
			width,
			height,
			depth,
			numberOfStripes,
			direction,
			stripes,
			svgRef
		]
	);

	return (
		<>
			<div className="relative flex items-center justify-center w-full gap-8 p-8 rounded bg-neutral-700 max-w-1/2">
				<div className="relative flex items-center justify-center w-full h-full">
					<svg
						ref={svgRef}
						className="h-full border border-neutral-800 flex max-w-full w-auto"
						style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}
					/>
				</div>
			</div>
			<div className="flex flex-col w-full h-full gap-2 p-2 rounded bg-neutral-700">
				<form className="w-full h-full p-4 rounded resize-none bg-neutral-800 grid grid-cols-2 gap-2">
					<fieldset className="flex flex-col gap-2 w-full">
						{
							[
								{
									name: "width",
									value: width,
									setter: setWidth,
									icon: <TbArrowRight />
								},
								{
									name: "height",
									value: height,
									setter: setHeight,
									icon: <TbArrowDown />
								},
								{
									name: "depth",
									value: depth,
									setter: setDepth,
									icon: <TbArrowUpRight />
								}
							]
								.map(({
									name,
									value,
									setter,
									icon
								}) => (
									<div className="flex gap-2 items-center">
										<label htmlFor={name} className="flex gap-2 items-center w-20">
											{icon}
											<span>{capitalize(name)}</span>
										</label>
										<input
											id={name}
											name={name}
											type="number"
											min={1}
											value={value}
											onChange={(event) => {
												setter(event.target.value);
											}}
											className="w-24 px-2 py-1 rounded font-mono bg-neutral-700"
										/>
									</div>
								))
						}
					</fieldset>
					<fieldset className="flex flex-col gap-2 w-full">
						<div className="flex gap-2 items-center w-full">
							<label htmlFor="numberOfStripes" className="flex gap-2 items-center w-44">
								<TbMenuOrder />
								<span>Number of Stripes</span>
							</label>
							<input
								id="numberOfStripes"
								name="numberOfStripes"
								type="number"
								min={1}
								value={numberOfStripes}
								onChange={(event) => {
									setNumberOfStripes(event.target.value);
								}}
								className="w-32 px-2 py-1 rounded font-mono bg-neutral-700"
							/>
						</div>
						<div className="flex gap-2 items-center w-full">
							<label htmlFor="direction" className="flex gap-2 items-center w-44">
								<TbArrowsRightDown />
								<span>Direction</span>
							</label>
							<div className="relative">
								<div className="absolute h-full right-2 flex items-center pointer-events-none">
									<TbChevronDown />
								</div>
								<select
									id="direction"
									name="direction"
									value={direction}
									onChange={(event) => {
										setDirection(event.target.value);
									}}
									className="w-32 pl-2 pr-8 py-1 rounded appearance-none bg-neutral-700"
								>
									<div></div>
									<option value="horizontal">Horizontal</option>
									<option value="vertical">Vertical</option>
								</select>
							</div>

						</div>
					</fieldset>
					<fieldset className="flex flex-col gap-2 w-full col-span-2">
						{
							Array(Number(numberOfStripes))
								.fill()
								.map((empty, index) => (
									<div className="flex gap-2 items-center w-full">
										<label htmlFor={`stripe-${index}`} className="flex gap-2 items-center w-44">
											<TbHash />
											<span>Stripe {index + 1}</span>
										</label>
										<fieldset className="flex gap-2">
											<div className="flex gap-2 items-center">
												<label htmlFor={`stripe-${index}-color`} className="flex gap-2 items-center w-20">
													<TbPalette />
													<span>Color</span>
												</label>
												<input
													id={`stripe-${index}-color`}
													name={`stripe-${index}-color`}
													type="color"
													value={stripes[index]?.color || "#000000"}
													// onInput={(event) => {
													// 	handleColorChange(event, index);
													// }}
													onChange={(event) => {
														handleColorChange(event, index);
													}}
													className="h-full px-1 aspect-square rounded font-mono bg-neutral-700"
												/>
											</div>
										</fieldset>
									</div>
								))
						}
					</fieldset>
				</form>
				<textarea className="w-full h-full p-4 font-mono rounded resize-none bg-neutral-800" readonly value={newSvg} />
			</div>
		</>
	);
};

export default SvgdTranspilerIsland;
