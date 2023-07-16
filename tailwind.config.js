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
				cards: "repeat(auto-fill, minmax(200px, 1fr))",
				"cards-lg": "repeat(auto-fill, minmax(300px, 1fr))"
			},
			keyframes: {
				"slide-left": {
					"0%": {
						transform: "rotate(12deg) translateX(0vw) skewX(0deg)"
					},
					"50%": {
						transform: "rotate(24deg) translateX(-50vw) skewX(-48deg)"
					},
					"100%": {
						transform: "rotate(12deg) translateX(-100vw) skewX(0deg)"
					}
				}
			},
			animation: {
				"slide-around": "60s ease-in-out infinite alternate slide-left"
			},
			spacing: {
				42: "10.5rem"
			},
			maxWidth: {
				"1/2": "50%"
			}
		}
	}
};
