import { Menu, Transition } from "@headlessui/react";
import {
	IconMenu2,
	IconX
} from "@tabler/icons-preact";
import { startCase } from "lodash-es";

/**
 *
 * @param root0
 * @param root0.items
 */
const MobileMenu = ({ items }) => (
	<li className="flex sm:hidden min-h-full h-full items-center justify-center relative">
		<Menu>
			{
				({ open }) => (
					<>
						<Menu.Button className="w-5 h-5 flex">
							<>
								<Transition
									show={open}
									enter="transition-opacity duration-75"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="transition-opacity duration-150"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
									className="absolute"
								>
									<IconX />
								</Transition>
								<Transition
									show={!open}
									enter="transition-opacity duration-75"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="transition-opacity duration-150"
									leaveFrom="opacity-100"
									leaveTo="opacity-0"
									className="absolute"
								>
									<IconMenu2 />
								</Transition>
							</>

						</Menu.Button>
						<Menu.Items
							as="ul"
							className="fixed bg-neutral-900 top-24 left-0 w-full h-[calc(100vh-1.5rem)] flex flex-col"
						>
							{
								items.map(({
									name,
									to = `/${name}`,
									title = startCase(name)
								}) => (
									<Menu.Item as="li" className="flex border-b first-child:border-t border-neutral-800">
										{({ active }) => (
											<a
												href={to}
												className="p-4 text-lg"
											>
												{title}
											</a>
										)}
									</Menu.Item>
								))
							}
						</Menu.Items>
					</>
				)
			}
		</Menu>
	</li>
);

export default MobileMenu;
