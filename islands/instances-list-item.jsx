import { Disclosure, Transition } from "@headlessui/react";
import { Temporal } from "@js-temporal/polyfill";
import cn from "classnames";
import { Fragment } from "preact";
import { useState } from "preact/hooks";
import { css, cx } from "twind";

import { asset } from "$fresh/runtime.ts";

const {
	ZonedDateTime
} = Temporal;

/**
 *
 * @param props
 * @param props.name
 * @param props.flags
 * @param props.fullName
 * @param props.startDate
 */
const InstancesListItem = ({
	name: instanceName,
	fullName,
	flags,
	startDate
}) => {
	const [disclosureOpen, setDisclosureOpen] = useState(false);

	const formattedStartDate = ZonedDateTime.from(startDate).toInstant().toString({ smallestUnit: "second" });

	return (
		<Disclosure
			as="li"
			className={cn(
				"border border-neutral-600 border-b-0 last-child:border-b flex flex-col gap-4 first-child:rounded-t last-child:rounded-b bg-gradient-to-b from-neutral-700 to-neutral-700 bg-no-repeat hover:from-neutral-600 hover:to-neutral-600",
				{
					"bg-[100%_0rem]": disclosureOpen,
					"bg-[100%_3.5rem]": !disclosureOpen
				}
			)}
		>
			{({ open }) => {
				setDisclosureOpen(open);

				return (
					<>
						<Disclosure.Button className="flex">
							<h6 className="p-4 text-ellipsis overflow-hidden whitespace-nowrap text-xs sm:text-base flex items-center gap-2">
								<span className="text-ellipsis overflow-hidden whitespace-nowrap">Instance {instanceName}</span>
								<span className="hidden sm:flex text-xs font-mono bg-neutral-700 px-1 py-0.5 rounded text-ellipsis overflow-hidden whitespace-nowrap">({formattedStartDate})</span>
							</h6>
						</Disclosure.Button>
						<Transition
							as={Fragment}
							enter="transition duration-100 ease-out"
							enterFrom="transform scale-95 opacity-0"
							enterTo="transform scale-100 opacity-100"
							leave="transition duration-75 ease-out"
							leaveFrom="transform scale-100 opacity-100"
							leaveTo="transform scale-95 opacity-0"
						>
							<Disclosure.Panel as="article" className="px-1 sm:px-4 pb-1 sm:pb-4">
								<ul className="grid gap-4 grid-cols-cards">
									{
										flags.map(({
											name, code, pngFlagPath
										}, index) => (
											<li className="w-full h-48" key={index}>
												<a href={`/${fullName}/${code}`}>
													<figure className="flex flex-col gap-2 w-full h-full justify-between items-center p-2 border border-neutral-600 rounded bg-neutral-800 hover:bg-neutral-700">
														<div className="w-full flex items-center justify-center h-36 p-2 bg-neutral-700 rounded">
															<img
																src={asset(pngFlagPath)}
																alt={`Flag of ${name} (according to ${instanceName})`}
																loading="lazy"
																className={cx`
																	max-w-full max-h-full border border-neutral-800
																	${css({ background: "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px" })}
																`}
															/>
														</div>

														<figcaption className="h-6 flex gap-2 items-center justify-center">
															<span className="text-sm">{name}</span>
															<span className="text-xs font-mono bg-neutral-700 px-1 py-0.5 rounded">({code})</span>
														</figcaption>
													</figure>
												</a>
											</li>
										))
									}
								</ul>
							</Disclosure.Panel>
						</Transition>
					</>
				);
			}}

		</Disclosure>
	);
};

export default InstancesListItem;
