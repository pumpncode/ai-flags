/**
 *
 * @param props
 * @param props.children
 */
const Main = ({ children }) => (
	<main className="flex flex-col w-full text-white grow shrink-0 bg-neutral-800">
		{children}
	</main>
);

export default Main;
