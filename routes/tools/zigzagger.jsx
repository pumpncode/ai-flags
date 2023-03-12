import { join, relative } from "std/path";
import { asset } from "$fresh/runtime.ts";
import { cx, css } from "twind";
import ZigzaggerIsland from "@ai-flags/islands/zigzagger.jsx";

const Zigzagger = () => {
	return (
		<section className="p-16 max-h-[calc(100vh-12rem)]">
			<h2 className="flex gap-2 items-center h-24">zigzagger</h2>

			<section className="flex gap-4 h-[calc(100vh-26rem)]">
				<ZigzaggerIsland />
			</section>
		</section>
	)
};

export default Zigzagger;