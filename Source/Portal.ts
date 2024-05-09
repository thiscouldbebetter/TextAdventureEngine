
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Portal
{
	name: string;
	description: string;
	placeDestinationName: string;
	scriptUseName: string;

	constructor
	(
		name: string,
		description: string,
		placeDestinationName: string,
		scriptUseName: string
	)
	{
		this.name = name;
		this.description = description;
		this.placeDestinationName = placeDestinationName;
		this.scriptUseName = scriptUseName;
	}

	static fromNameAndPlaceDestinationName
	(
		name: string, placeDestinationName: string
	): Portal
	{
		return new Portal(name, null, placeDestinationName, null);
	}

	goThrough(universe: Universe, world: World, place: Place): void
	{
		var placeNextName = this.placeDestinationName;
		var placeNext = world.placeByName(placeNextName);
		world.placeCurrentSet(placeNext);
	}

	use(universe: Universe, world: World, place: Place): void
	{
		if (this.scriptUseName == null)
		{
			this.goThrough(universe, world, place);
		}
		else
		{
			var scriptUse = world.scriptByName(this.scriptUseName);
			scriptUse.run(universe, world, place, this);
		}
	}

	// Clonable.

	clone(): Portal
	{
		return new Portal
		(
			this.name,
			this.description,
			this.placeDestinationName,
			this.scriptUseName
		);
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, Portal.prototype);
	}

}

}
