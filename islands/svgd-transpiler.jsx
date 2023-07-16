import { useEffect, useState } from "preact/hooks";

import { svgdTranspiler } from "@/utilities/client.js";

/**
 *
 */
const SvgdTranspilerIsland = () => {
	const [svgd, setSvgd] = useState(
		`
		1440, 900
		rect: blueStripe, 0, 0, 1440, 300, blue, 0, _
		rect: whiteStripe, 0, 300, 1440, 300, white, 0, _
		rect: greenStripe, 0, 600, 1440, 300, green, 0, _
		star: star, 720, 450, _, 200, 5, red, 0, white
		polygon: triangle, 0, 0, 450, 450, 0, 900, red, 0, _
		circle: circle, 175, 450, 100, white, 50, #000000
		`
			.trim()
			.replaceAll("\t", "")
	);

	const [newSvg, setNewSvg] = useState(null);

	useEffect(() => {
		if (svgd) {
			try {
				const svg = svgdTranspiler(svgd);

				setNewSvg(svg);
			}
			catch (error) {
				console.error(error);
			}
		}
	}, [svgd]);

	return (
		<>
			<div className="relative flex items-center justify-center w-full gap-8 p-8 rounded bg-neutral-700">
				<div className="relative flex items-center justify-center w-full h-full">
					<div
						className="h-full border border-neutral-800 flex"
						style={{ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" }}
						dangerouslySetInnerHTML={{ __html: newSvg }}
					/>
				</div>

			</div>
			<div className="flex flex-col w-full h-full gap-2 p-2 rounded bg-neutral-700">
				<textarea className="w-full h-full p-4 font-mono rounded resize-none bg-neutral-800" value={svgd} onInput={({ target: { value } }) => setSvgd(value)} />
				<textarea className="w-full h-full p-4 font-mono rounded resize-none bg-neutral-800" readonly value={newSvg} />
			</div>
		</>
	);
};

export default SvgdTranspilerIsland;
