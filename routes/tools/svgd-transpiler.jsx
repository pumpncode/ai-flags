import SvgdTranspilerIsland from "@/islands/svgd-transpiler.jsx";

/**
 *
 */
const Zigzagger = () => (
	<section className="p-16 max-h-[calc(100vh-12rem)]">
		<h2 className="flex items-center h-24 gap-2">svgd-transpiler</h2>

		<section className="flex gap-4 h-[calc(100vh-26rem)]">
			<SvgdTranspilerIsland />
		</section>
	</section>
);

export default Zigzagger;
