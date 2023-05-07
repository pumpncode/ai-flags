import { Disclosure, Transition } from "@headlessui/react";
import { Temporal } from "@js-temporal/polyfill";
import { TbLink } from "react-icons/tb";
import cn from "classnames";
import { Fragment } from "preact";
import { useState } from "preact/hooks";

import InstanceContent from "../components/features/instance-content.jsx";
import Button from "../components/input/button.jsx";

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
				"border border-neutral-600 border-b-0 last:border-b flex flex-col gap-4 first:rounded-t last:rounded-b bg-gradient-to-b from-neutral-700 to-neutral-700 bg-no-repeat hover:from-neutral-600 hover:to-neutral-600",
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
						<Disclosure.Button className="flex w-full">
							<div className="flex items-center justify-between w-full px-4">
								<h6 className="flex items-center gap-2 py-4 overflow-hidden text-xs text-ellipsis whitespace-nowrap sm:text-base">
									<span className="overflow-hidden text-ellipsis whitespace-nowrap">Instance {instanceName}</span>
									<span className="hidden sm:flex text-xs font-mono bg-neutral-700 px-1 py-0.5 rounded text-ellipsis overflow-hidden whitespace-nowrap">({formattedStartDate})</span>
								</h6>
								<a
									href={`/vexillologists/${fullName}`}
									onClick={(event) => {
										event.stopPropagation();
									}}
								>
									<Button variant="transparent" size="sm"><TbLink size={24} /></Button>
								</a>
							</div>
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
							<Disclosure.Panel as="article" className="px-1 pb-1 sm:px-4 sm:pb-4">
								<InstanceContent flags={flags} fullName={fullName} />
							</Disclosure.Panel>
						</Transition>
					</>
				);
			}}

		</Disclosure>
	);
};

export default InstancesListItem;
