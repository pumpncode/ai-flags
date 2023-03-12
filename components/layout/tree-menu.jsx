import cn from "classnames";

/**
 *
 * @param options
 * @param options.rootEntity
 * @param options.href
 * @param options.openIds
 */
const TreeMenu = ({
	rootEntity,
	href,
	openIds = [],
	...otherProps
}) => {
	const recurse = (entity, parentHref = href) => {
		const currentHref = `${parentHref}/${entity.id}`;

		const open = openIds.includes(String(entity.id));

		const active = openIds.at(-1) === String(entity.id);

		const linkElement = (
			<>
				{
					entity.children && (
						<span className="bg-neutral-200 text-neutral-800 w-8 flex items-center justify-center font-bold text-sm shrink-0">+</span>
					)
				}
				<a
					href={currentHref}
					className={cn(
						"p-4 grow",
						{
							"bg-blue-600 text-neutral-200 invert": active,
							"pl-12": !entity.children
						}
					)}
				>
					{entity.name}
				</a>
			</>

		);

		if (Object.hasOwn(entity, "children")) {
			return (
				<details className="open:pb-4 group" open={open} id={entity.id}>
					<summary className="cursor-pointer flex items-stretch border-b border-neutral-200">{linkElement}</summary>
					<ul className="pl-4 pr-4">
						{
							[...Object.entries(entity.children)]
								.sort(([idA, { name: nameA }], [idB, { name: nameB }]) => Intl.Collator().compare(nameA, nameB))
								.map(([id, child]) => (
									<li
										className={cn(
											"bg-black/5 flex flex-col gap-4 hover:bg-black/10 border border-neutral-200 border-t-0 last-child:rounded-b overflow-hidden",
											{
												"border-b-0 group:open:border-b-1": child.children
											}
										)}
									>
										{
											recurse(
												{
													...child,
													id
												},
												currentHref
											)
										}
									</li>
								))
						}
					</ul>
				</details>
			);
		}

		return linkElement;
	};

	return (
		<ul {...otherProps}>
			<li className="bg-black/5 flex flex-col gap-4 border border-neutral-200 border-b-0 rounded overflow-hidden hover:bg-black/10">
				{recurse(rootEntity)}
			</li>
		</ul>
	);
};

export default TreeMenu;
