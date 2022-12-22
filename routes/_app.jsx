import { Head } from "fresh/runtime.ts";

import Header from "../components/layout/header.jsx";
import Main from "../components/layout/main.jsx";
import Footer from "../components/layout/footer.jsx";

import BaseStyle from "../components/style/base.jsx";

const App = ({ Component }) => {
	return (
		<>
			<Head className="dark" lang="en">
				<title>AI Flags</title>
			</Head>
			<Header />
			<Main>
				<BaseStyle />
				<Component />
			</Main>
			<Footer />
		</>
	);
};

export default App;