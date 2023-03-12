import { Head, asset } from "fresh/runtime.ts";

import Header from "../components/layout/header.jsx";
import Main from "../components/layout/main.jsx";
import Footer from "../components/layout/footer.jsx";

import FontsStyle from "../components/style/fonts.jsx";

const App = ({ Component }) => {
	return (
		<>
			<Head className="dark" lang="en">
				<title>AI Flags</title>
				<FontsStyle />
			</Head>
			<Header />
			<Main>
				<Component />
			</Main>
			<Footer />
		</>
	);
};

export default App;