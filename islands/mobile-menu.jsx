import { Menu, Transition } from "@headlessui/react";
import {
	TbMenu2,
	TbX
} from "react-icons/tb";
import { startCase } from "lodash-es";

/**
 *
 * @param props
 * @param props.items
 */
const MobileMenu = ({ items }) => (
	<li className="relative flex items-center justify-center h-full min-h-full sm:hidden">
		<Menu>
			{
				({ open }) => (
					<>
						<Menu.Button className="flex w-5 h-5">
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
									<TbX size={24} />
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
									<TbMenu2 size={24} />
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
									<Menu.Item as="li" className="flex border-b first:border-t border-neutral-800">
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
