export default {
	content: ["./**/*.jsx"],
	theme: {
		// https://tailwindcss.com/docs/container#centering-by-default
		container: {
			center: true
		},
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
