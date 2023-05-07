/**
 *
 * @param props
 * @param props.children
 * @param props.to
 */
const Link = ({
	children, to, ...props
}) => (
	<a
		{...{
			href: to,
			...props
		}}
		target="_blank"
		className="underline text-cyan-500 hover:no-underline"
	>
		{children}
	</a>
);

export default Link;
