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
			<link href={asset("/style/tailwind.css")} rel="stylesheet" />
			<link rel="icon" href="/favicons/icon.svg" type="image/svg+xml" />
			<link rel="icon" href="/favicons/favicon.ico" sizes="any" />
			<link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
			<link rel="manifest" href="/favicons/manifest.webmanifest" />
			<img src={asset("/favicons/icon.svg")} style="display:none" />
		</Head>
		<Header />
		<Main>
			<Component />
		</Main>
		<Footer />
	</>
);

export default App;
