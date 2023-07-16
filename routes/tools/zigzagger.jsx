import ZigzaggerIsland from "@/islands/zigzagger.jsx";

/**
 *
 */
const Zigzagger = () => (
	<section className="p-16 max-h-[calc(100vh-12rem)]">
		<h2 className="flex items-center h-24 gap-2">zigzagger</h2>

		<section className="flex gap-4 h-[calc(100vh-26rem)]">
			<ZigzaggerIsland />
		</section>
	</section>
);

export default Zigzagger;
