
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Portal
{
	names: string[];
	description: string;
	placeDestinationName: string;
	scriptUseName: string;
	stateGroup: StateGroup;

	constructor
	(
		names: string[],
		description: string,
		placeDestinationName: string,
		scriptUseName: string,
		stateGroup: StateGroup
	)
	{
		this.names = names;
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
		return Portal.fromNamesAndPlaceDestinationName( [ name ], placeDestinationName );
	}

	static fromNamesAndPlaceDestinationName
	(
		names: string[], placeDestinationName: string
	): Portal
	{
		return new Portal(names, null, placeDestinationName, null, null);
	}

	name(): string
	{
		return this.names[0];
	}

	namesInclude(nameToMatch: string): boolean
	{
		return this.names.indexOf(nameToMatch) >= 0;
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
			this.names.map(x => x),
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

	// Locking.

	lock(): Portal
	{
		return this.lockedSet(true);
	}

	locked(): boolean
	{
		return this.stateWithNameIsTrue("Locked");
	}

	lockedSet(value: boolean): Portal
	{
		return this.stateWithNameSetToValue("Locked", value);
	}

	unlock(): Portal
	{
		return this.lockedSet(false);
	}

	// Visibility.

	hide(): Portal
	{
		return this.visibleSet(false);
	}

	show(): Portal
	{
		return this.visibleSet(true);
	}

	visible(): boolean
	{
		return this.stateWithNameIsTrue("Visible");
	}

	visibleSet(value: boolean): Portal
	{
		return this.stateWithNameSetToTrue("Visible");
	}

}

}
