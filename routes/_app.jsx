import { Head } from "fresh/runtime.ts";

import Footer from "../components/layout/footer.jsx";
import Header from "../components/layout/header.jsx";
import Main from "../components/layout/main.jsx";
import FontsStyle from "../components/style/fonts.jsx";

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
