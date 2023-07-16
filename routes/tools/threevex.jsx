import ThreevexIsland from "@/islands/threevex.jsx";

/**
 *
 */
const Threevex = () => (
	<section className="p-16 max-h-[calc(100vh-12rem)]">
		<h2 className="flex items-center h-24 gap-2">threevex</h2>

		<section className="flex gap-4 h-[calc(100vh-26rem)]">
			<ThreevexIsland />
		</section>
	</section>
);

export default Threevex;
