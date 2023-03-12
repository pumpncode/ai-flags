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
		className="text-cyan-500 underline hover:no-underline"
	>
		{children}
	</a>
);

export default Link;
