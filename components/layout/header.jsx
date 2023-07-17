import { TbBrandGithub } from "react-icons/tb";
import cn from "classnames";
import { startCase } from "lodash-es";

import MobileMenu from "../../islands/mobile-menu.jsx";
import Button from "../input/button.jsx";

import { asset } from "$fresh/runtime.ts";

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
				<>
					<h1 className="text-4xl font-bold sr-only sm:text-5xl">AI Flags</h1>
					<img src={asset("/images/logos/ai-flags-wordmark.svg")} className="hidden h-full sm:block" />
					<img src={asset("/images/logos/ai-flags-icon.svg")} className="block h-full sm:hidden" />
				</>
			),
			customClassName: "h-full"
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
			to: "https://shop.ai-flags.com",
			name: "shop",
			custom: () => (
				<Button size="2xl"><span>Shop</span></Button>
			)
		},
		{
			to: "https://github.com/pumpncode/ai-flags",
			name: "github",
			title: "GitHub",
			custom: () => (
				<Button variant="transparent" size="2xl"><TbBrandGithub size={24} /></Button>
			)
		}
	];

	return (
		<header className="z-10 h-24 text-white bg-neutral-900">
			<nav aria-label="Main Navigation" className="w-full h-full">
				<ul className="grid w-full h-full grid-cols-headerMobile sm:grid-cols-header">
					{
						navigationItems
							.map((
								{
									name,
									to = `/${name}`,
									title = startCase(name),
									custom,
									customLink,
									customClassName
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
												className={cn("flex items-center justify-center first:p-6", customClassName)}
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
