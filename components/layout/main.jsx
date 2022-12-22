const Main = ({ children }) => {
	return (
		<main className="flex flex-col flex-grow flex-shrink-0 w-screen z-0 bg-neutral-800 text-white">
			{children}
		</main>
	)
};

export default Main;