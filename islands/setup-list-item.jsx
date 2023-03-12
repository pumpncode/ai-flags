import { Fragment } from "preact";
import { Disclosure, Transition } from "@headlessui/react-browser";
import { asset } from "$fresh/runtime.ts";
import { cx, css } from "twind";
import { join } from "std/path";

const SetupListItem = ({ name: setupName, flags }) => {
	return (
		<li className="border border-neutral-600 border-b-0 last-child:border-b p-4 flex flex-col gap-4 first-child:rounded-t last-child:rounded-b">
			<Disclosure as={Fragment}>
				<Disclosure.Button>
					<h3 className="w-max">{setupName}</h3>
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
					<Disclosure.Panel as="article">
						<ul className="grid grid-cols-5 gap-4">
							{
								flags.map(({ name, code, pngFlagPath }, index) => (
									<li className="w-full h-48" key={index}>
										<a href={`/${setupName}/${code}`}>
											<figure className="flex flex-col gap-2 w-full h-full justify-between items-center p-2 border border-neutral-600 rounded hover:bg-neutral-700">
												<div className="w-full flex items-center justify-center h-36 p-2 bg-neutral-700 rounded">
													<img
														src={asset(pngFlagPath)}
														alt={`Flag of ${name} (according to ${setupName})`}
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
			</Disclosure>
		</li>
	)
};
/* <li key={index} className="border border-neutral-600 first-child:border-b-0 p-4 flex flex-col gap-4">
	<h3>{setupName}</h3>
	<article>
		<ul className="grid grid-cols-5 gap-4">
			{
				setupContent.map(({ name, code, pngFlagPath }, index) => (
					<li className="w-full h-48" key={index}>
						<a href={`/${setupName}/${code}`}>
							<figure className="flex flex-col gap-2 w-full h-full justify-between items-center p-2 border border-neutral-600 rounded hover:bg-neutral-700">
								<div className="w-full flex items-center justify-center h-36 p-2 bg-neutral-700 rounded">
									<img
										src={asset(pngFlagPath)}
										alt={`Flag of ${name} (according to ${setupName})`}
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
	</article>
</li> */


export default SetupListItem;