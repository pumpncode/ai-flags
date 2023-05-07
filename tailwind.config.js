export default {
	content: [
		"./routes/**/*.jsx",
		"./components/**/*.jsx",
		"./islands/**/*.jsx"
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["\"Inter\"", "sans-serif"],
				mono: ["\"Roboto Mono\"", "monospace"]
			},
			gridTemplateColumns: {
				header: "50% repeat(auto-fit,minmax(5%,1fr))",
				headerMobile: "75% repeat(auto-fit,minmax(5%,1fr))",
				cards: "repeat(auto-fill, minmax(200px, 1fr))"
			}
		}
	}
};
