
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Item
{
	names: string[];
	description: string;
	_scriptGetName: string;
	_scriptUseName: string;
	stateGroup: StateGroup;
	commands: Command[];

	constructor
	(
		names: string[],
		description: string,
		scriptGetName: string,
		scriptUseName: string,
		stateGroup: StateGroup,
		commands: Command[]
	)
	{
		this.names = names;
		this.description = description;
		this._scriptGetName = scriptGetName;
		this._scriptUseName = scriptUseName;
		this.stateGroup = stateGroup || new StateGroup([]);
		this.commands = commands || [];
	}

	static fromNamesAndDescription(names: string[], description: string): Item
	{
		return new Item( names, description, null, null, null, null);
	}

	static fromNamesDescriptionAndScriptUseName
	(
		names: string[], description: string, scriptUseName: string
	): Item
	{
		return new Item(names, description, null, scriptUseName, null, null);
	}

	static fromNamesDescriptionAndScriptGetName
	(
		names: string[], description: string, scriptGetName: string
	): Item
	{
		return new Item(names, description, scriptGetName, null, null, null);
	}
	canBeUsed(): boolean
	{
		return (this._scriptUseName != null);
	}

	commandAdd(command: Command): Item
	{
		this.commands.push(command);
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

	scriptGet(world: World): Script
	{
		return this._scriptGetName == null ? null : world.scriptByName(this._scriptGetName);
	}

	scriptUse(world: World): Script
	{
		return world.scriptByName(this._scriptUseName);
	}

	updateForTurn(): void
	{
		// todo
	}

	use(universe: Universe, world: World, place: Place, target: any): void
	{
		var scriptUse = this.scriptUse(world);
		if (scriptUse != null)
		{
			scriptUse.run(universe, world, place, this, target);
		}
	}

	visible(): boolean
	{
		return true;
	}

	// Clonable.

	clone(): Item
	{
		return new Item
		(
			this.names.map(x => x),
			this.description,
			this._scriptGetName,
			this._scriptUseName,
			this.stateGroup.clone(),
			this.commands.map(x => x.clone() )
		);
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, Item.prototype);
		StateGroup.prototypesSet(instanceAsObject.stateGroup);
		instanceAsObject.commands.forEach( (x: any) => Command.prototypesSet(x) );
	}
}

}
