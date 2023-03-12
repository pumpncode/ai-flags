import { startCase } from "npm:lodash-es";
import { cx } from "twind";

import Button from "../input/button.jsx";

const {
	env
} = Deno;

/**
 *
 */
const Header = () => {
	const navigationItems = [
		{
			to: "/",
			name: "index",
			title: "Home",
			custom: () => (
				<h1 className="font-bold">AI Flags</h1>
			)
		},
		{
			name: "setups"
		},
		{
			name: "entities"
		},
		{
			name: "tools"
		}
	];

	return (
		<header className="h-24 bg-neutral-900 text-white">
			<nav aria-label="Main Navigation" className="h-full w-full">
				<ul className="grid grid-cols-header h-full w-full">
					{
						navigationItems
							.map(({
								name, to = `/${name}`, title = startCase(name), custom, customLink
							}) => (
								<li className={cx`min-h-full h-full flex items-center justify-center first-child:justify-start`} key={name}>
									{
										customLink
											? customLink()
											: <a href={to} className="flex justify-center items-center first-child:p-6">
												{
													custom
														? custom()
														: <Button variant="transparent" size="2xl">{title}</Button>
												}
											</a>
									}
								</li>
							))
					}
				</ul>
			</nav>
		</header>
	);
};

export default Header;
