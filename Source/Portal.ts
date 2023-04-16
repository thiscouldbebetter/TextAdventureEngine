
class Portal
{
	name: string;
	description: string;
	placeDestinationName: string;

	constructor
	(
		name: string,
		description: string,
		placeDestinationName: string
	)
	{
		this.name = name;
		this.description = description;
		this.placeDestinationName = placeDestinationName;
	}

	// Clonable.

	clone(): Portal
	{
		return new Portal
		(
			this.name,
			this.description,
			this.placeDestinationName
		);
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, Portal.prototype);
	}

}
