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
				<h1 className="font-bold text-4xl sm:text-5xl">AI Flags</h1>
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
			to: "https://github.com/pumpncode/ai-flags",
			name: "github",
			title: "GitHub",
			custom: () => (
				<Button variant="transparent" size="2xl"><IconBrandGithub /></Button>
			)
		},
	];

	return (
        <header className="h-24 bg-neutral-900 text-white z-10">
			<nav aria-label="Main Navigation" className="h-full w-full">
				<ul className="grid grid-cols-headerMobile sm:grid-cols-header h-full w-full">
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
										"min-h-full h-full items-center justify-center first-child:justify-start",
										{
											"hidden sm:flex": index !== 0,
											"flex": index === 0
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
												className="flex justify-center items-center first-child:p-6"
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
