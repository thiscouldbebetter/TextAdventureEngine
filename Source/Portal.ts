
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Portal
{
	name: string;
	description: string;
	placeDestinationName: string;
	scriptUseName: string;
	stateGroup: StateGroup;

	constructor
	(
		name: string,
		description: string,
		placeDestinationName: string,
		scriptUseName: string,
		stateGroup: StateGroup
	)
	{
		this.name = name;
		this.description = description;
		this.placeDestinationName = placeDestinationName;
		this.scriptUseName = scriptUseName;
		this.stateGroup = stateGroup || StateGroup.create();
	}

	static fromNameAndPlaceDestinationName
	(
		name: string, placeDestinationName: string
	): Portal
	{
		return new Portal(name, null, placeDestinationName, null, null);
	}

	goThrough(universe: Universe, world: World): void
	{
		var placeNextName = this.placeDestinationName;
		var placeNext = world.placeByName(placeNextName);
		world.placeCurrentSet(placeNext);
	}

	use(universe: Universe, world: World, place: Place): void
	{
		if (this.scriptUseName == null)
		{
			this.goThrough(universe, world);
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
			this.scriptUseName,
			this.stateGroup.clone()
		);
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, Portal.prototype);
	}

	// States.

	locked(): boolean
	{
		return this.stateWithNameIsTrue("Locked");
	}

	lockedSet(): Portal
	{
		return this.stateWithNameSetToTrue("Locked");
	}

	stateWithNameGetValue(stateToGetName: string): any
	{
		return this.stateGroup.stateWithNameGetValue(stateToGetName);
	}

	stateWithNameIsTrue(stateName: string): boolean
	{
		return (this.stateWithNameGetValue(stateName) == true);
	}

	stateWithNameSetToValue(stateToSetName: string, valueToSet: any): Portal
	{
		this.stateGroup.stateWithNameSetToValue(stateToSetName, valueToSet);
		return this;
	}

	stateWithNameSetToTrue(stateToSetName: string): Portal
	{
		return this.stateWithNameSetToValue(stateToSetName, true);
	}

	visible(): boolean
	{
		return this.stateWithNameIsTrue("Visible");
	}

}

}
