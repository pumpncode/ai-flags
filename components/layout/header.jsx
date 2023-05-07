import { IconBrandGithub } from "@tabler/icons-preact";
import cn from "classnames";
import { startCase } from "lodash-es";

import MobileMenu from "../../islands/mobile-menu.jsx";
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
				<h1 className="text-4xl font-bold sm:text-5xl">AI Flags</h1>
			)
		},
		// {
		// 	name: "setups"
		// },
		{
			name: "entities"
		},
		{
			name: "tools"
		},
		{
			name: "about"
		},
		{
			to: "https://github.com/pumpncode/ai-flags",
			name: "github",
			title: "GitHub",
			custom: () => (
				<Button variant="transparent" size="2xl"><IconBrandGithub /></Button>
			)
		}
	];

	return (
		<header className="z-10 h-24 text-white bg-neutral-900">
			<nav aria-label="Main Navigation" className="w-full h-full">
				<ul className="w-full h-full grid grid-cols-headerMobile sm:grid-cols-header">
					{
						navigationItems
							.map((
								{
									name,
									to = `/${name}`,
									title = startCase(name),
									custom,
									customLink
								},
								index
							) => (
								<li
									className={cn(
										"min-h-full h-full items-center justify-center first:justify-start",
										{
											"hidden sm:flex": index !== 0,
											flex: index === 0
										}
									)}
									key={name}
								>
									{
										customLink
											? customLink()
											: <a
												href={to}
												target={to.match(/^https?/) ? "_blank" : "_self"}
												className="flex items-center justify-center first:p-6"
											>
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
					<MobileMenu items={navigationItems} />
				</ul>
			</nav>
		</header>
	);
};

export default Header;
