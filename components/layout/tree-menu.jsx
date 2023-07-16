import cn from "classnames";
import { TbPlus } from "react-icons/tb";

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
						<span className="flex items-center justify-center w-12 text-sm font-bold bg-neutral-200 text-neutral-800 shrink-0 md:w-8">
							<TbPlus size={24} />
						</span>
					)
				}
				<a
					href={`${currentHref}#${entity.name}`}
					className={cn(
						"p-4 grow",
						{
							"bg-amber-300 text-neutral-900": active,
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
				<details className="open:pb-4" open={open} id={entity.id}>
					<summary
						className={cn(
							"flex items-stretch border-b-0 cursor-pointer border-neutral-200"
						)}
					>
						{linkElement}
					</summary>
					<ul className="pl-4 pr-4 border-t border-neutral-200">
						{
							[...Object.entries(entity.children)]
								.sort(([idA, { name: nameA }], [idB, { name: nameB }]) => Intl.Collator().compare(nameA, nameB))
								.map(([id, child]) => (
									<li
										className={cn(
											"bg-black/5 flex flex-col gap-4 hover:bg-black/10 border border-neutral-200 border-t-0 last:rounded-b overflow-hidden"
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
			<li className="flex flex-col gap-4 overflow-hidden border rounded bg-black/5 border-neutral-200 hover:bg-black/10">
				{recurse(rootEntity)}
			</li>
		</ul>
	);
};

export default TreeMenu;
