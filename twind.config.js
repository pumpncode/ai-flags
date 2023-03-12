import presetTailwind from "@twind/preset-tailwind";

export default {
	darkMode: "class",
	mode: "silent",
	theme: {
		extend: {
			fontFamily: {
				sans: ["\"Inter\"", "sans-serif"],
				mono: ["\"Roboto Mono\"", "monospace"]
			},
			gridTemplateColumns: {
				header: "50% repeat(auto-fit,minmax(5%,1fr))"
			}
		}
	},
	preflight: {
		"@import": "url(\"https://rsms.me/inter/inter.css\")"
	},
	selfURL: import.meta.url,
	presets: [
		presetTailwind({
			// disabled to reduce noisein CSS tab
			disablePreflight: true
		})
	]
};
