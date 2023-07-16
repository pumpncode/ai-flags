import InstancesListItem from "../../islands/instances-list-item.jsx";

/**
 *
 * @param props
 * @param props.instances
 * @param props.fullVariantName
 */
const InstancesList = ({
	instances,
	fullVariantName
}) => (
	<ul className="w-full bg-white bg-opacity-5">
		{
			instances
				.map(({
					name: instanceName,
					score,
					flags
				}) => (
					<InstancesListItem
						key={instanceName}
						{...{
							fullVariantName,
							instanceName,
							score,
							flags
						}}
					/>
				))

		}
	</ul>
);

export default InstancesList;
