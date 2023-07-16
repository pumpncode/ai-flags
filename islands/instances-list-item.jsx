import { Disclosure, Transition } from "@headlessui/react";
import { TbLink, TbRosetteFilled } from "react-icons/tb";
import cn from "classnames";
import { Fragment } from "preact";
import { useState } from "preact/hooks";

import InstanceContent from "../components/features/instance-content.jsx";
import Button from "../components/input/button.jsx";

/**
 *
 * @param props
 * @param props.vexillologistName
 * @param props.vexillographerName
 * @param props.variantName
 * @param props.instanceName
 * @param props.score
 * @param props.flags
 */
const InstancesListItem = ({
	vexillologistName,
	vexillographerName,
	variantName,
	instanceName,
	score,
	flags
}) => {
	const [disclosureOpen, setDisclosureOpen] = useState(false);

	const fullName = [
		vexillologistName,
		vexillographerName,
		variantName,
		instanceName
	].join("/");

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
								<h6 className="relative flex items-center gap-2 py-4 text-xs text-ellipsis whitespace-nowrap sm:text-base">
									<span className="overflow-hidden text-ellipsis whitespace-nowrap">Instance {instanceName}</span>
									<span className="relative flex items-center justify-center w-12 font-mono">
										<TbRosetteFilled
											size={48}
											className="absolute text-amber-300"
											style={{
												filter: `drop-shadow(0 0 10px #fcd34d40) saturate(${score}) `
											}}
										/>
										<span className="absolute text-xs font-bold text-neutral-800">
											{score * 1000}
										</span>
									</span>
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
