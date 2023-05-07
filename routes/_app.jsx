import Footer from "../components/layout/footer.jsx";
import Header from "../components/layout/header.jsx";
import Main from "../components/layout/main.jsx";
import FontsStyle from "../components/style/fonts.jsx";

import { asset, Head } from "$fresh/runtime.ts";

/**
 *
 * @param props
 * @param props.Component
 */
const App = ({ Component }) => (
	<>
		<Head className="dark" lang="en">
			<title>AI Flags</title>
			<FontsStyle />
			<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/themes/prism-tomorrow.min.css" />
			<link href={asset("/style/base.css")} rel="stylesheet" />
			<link href={asset("/style/tailwind.css")} rel="stylesheet" />
			<link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
			<link rel="icon" href="/favicons/favicon.ico" sizes="any" />
			<link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
			<link rel="manifest" href="/favicons/manifest.webmanifest" />
		</Head>
		<Header />
		<Main>
			<Component />
		</Main>
		<Footer />

		<script src="https://cdn.jsdelivr.net/npm/prismjs@1.29.0/prism.min.js" />
	</>
);

export default App;
