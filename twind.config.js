export default {
	darkMode: "class",
	mode: "silent",
	theme: {
		extend: {
			fontFamily: {
				sans: ['"Inter"', "sans-serif"],
			},
			gridTemplateColumns: {
				header: "50% repeat(auto-fit,minmax(5%,1fr))",
			},
		},
	},
	preflight: {
		"@import": 'url("https://rsms.me/inter/inter.css")',
	},
	selfURL: import.meta.url,
};
