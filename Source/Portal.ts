
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Portal
{
	names: string[];
	descriptionWhenExamined: string;
	placeDestinationName: string;
	scriptUseName: string;
	stateGroup: StateGroup;

	_visible: boolean;
	_passable: boolean;

	constructor
	(
		names: string[],
		descriptionWhenExamined: string,
		placeDestinationName: string,
		scriptUseName: string,
		visible: boolean,
		passable: boolean,
		stateGroup: StateGroup
	)
	{
		this.names = names;
		this.descriptionWhenExamined = descriptionWhenExamined;
		this.placeDestinationName = placeDestinationName;
		this.scriptUseName = scriptUseName;
		this._visible = visible || true;
		this._passable = passable || false;
		this.stateGroup = stateGroup || StateGroup.create();
	}

	static fromNameAndPlaceDestinationName
	(
		name: string, placeDestinationName: string
	): Portal
	{
		return Portal.fromNamesAndPlaceDestinationName( [ name ], placeDestinationName );
	}

	static fromNames
	(
		names: string[]
	): Portal
	{
		return new Portal
		(
			names, null, null, null, true, true, null
		);
	}

	static fromNamesAndPlaceDestinationName
	(
		names: string[], placeDestinationName: string
	): Portal
	{
		return Portal
			.fromNames(names)
			.placeDestinationNameSet(placeDestinationName);
	}

	static fromNamesDescriptionAndPlaceDestinationName
	(
		names: string[], descriptionWhenExamined: string, placeDestinationName: string
	): Portal
	{
		return Portal
			.fromNames(names)
			.descriptionWhenExaminedSet(descriptionWhenExamined)
			.placeDestinationNameSet(placeDestinationName);
	}

	descriptionWhenExaminedSet(value: string): Portal
	{
		this.descriptionWhenExamined = value;
		return this;
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
		var portalIsLocked = this.locked();
		if (portalIsLocked)
		{
			universe.messageEnqueue("That way is not currently passable.");
		}
		else
		{
			var placeNextName = this.placeDestinationName;
			var placeNext = world.placeByName(placeNextName);
			world.placeCurrentSet(placeNext);
		}
	}

	placeDestinationNameSet(value: string): Portal
	{
		this.placeDestinationName = value;
		return this;
	}

	scriptUseNameSet(value: string): Portal
	{
		this.scriptUseName = value;
		return this;
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
			scriptUse.run(universe, world, place, this, null);
		}
	}

	// Clonable.

	clone(): Portal
	{
		return new Portal
		(
			this.names.map(x => x),
			this.descriptionWhenExamined,
			this.placeDestinationName,
			this.scriptUseName,
			this._visible,
			this._passable,
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

	// Blocking.

	block(): Portal
	{
		this._passable = false;
		return this;
	}

	blocked(): boolean
	{
		return (this._passable == false);
	}

	passable(): boolean
	{
		return this._passable;
	}

	unblock(): Portal
	{
		this._passable = true;
		return this;
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
		return this._visible;
	}

	visibleSet(value: boolean): Portal
	{
		this._visible = value;
		return this;
	}

}

}
