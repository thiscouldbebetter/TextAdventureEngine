
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Item
{
	names: string[];
	description: string;
	_scriptGetName: string;
	_scriptUseName: string;
	stateGroup: StateGroup;
	items: Item[];
	commands: Command[];

	constructor
	(
		names: string[],
		description: string,
		scriptGetName: string,
		scriptUseName: string,
		stateGroup: StateGroup,
		items: Item[],
		commands: Command[]
	)
	{
		this.names = names;
		this.description = description;
		this._scriptGetName = scriptGetName;
		this._scriptUseName = scriptUseName;
		this.stateGroup = stateGroup || new StateGroup([]);
		this.items = items || [];
		this.commands = commands || [];
	}

	static create(): Item
	{
		return new Item(null, null, null, null, null, null, null);
	}

	static fromNames(names: string[]): Item
	{
		return Item.create().namesSet(names);
	}

	static fromNamesAndDescription(names: string[], description: string): Item
	{
		return Item.fromNames(names).descriptionSet(description);
	}

	static fromNamesDescriptionAndScriptUseName
	(
		names: string[], description: string, scriptUseName: string
	): Item
	{
		return Item.fromNamesAndDescription(names, description).scriptUseNameSet(scriptUseName);
	}

	static fromNamesDescriptionAndScriptGetName
	(
		names: string[], description: string, scriptGetName: string
	): Item
	{
		return Item.fromNamesAndDescription(names, description).scriptGetNameSet(scriptGetName);
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

	descriptionSet(value: string): Item
	{
		this.description = value;
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

	itemAdd(itemToAdd: Item): Item
	{
		this.items.push(itemToAdd);
		return this;
	}

	itemsAdd(itemsToAdd: Item[]): Item
	{
		itemsToAdd.forEach(x => this.items.push(x) );
		return this;
	}

	namesSet(value: string[]): Item
	{
		this.names = value;
		return this;
	}

	scriptGet(world: World): Script
	{
		return this._scriptGetName == null ? null : world.scriptByName(this._scriptGetName);
	}

	scriptGetNameSet(value: string): Item
	{
		this._scriptGetName = value;
		return this;
	}

	scriptUse(world: World): Script
	{
		return world.scriptByName(this._scriptUseName);
	}

	scriptUseNameSet(value: string): Item
	{
		this._scriptUseName = value;
		return this;
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
			this.items.map(x => x.clone() ),
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

	// States - Activation.

	activate(): Item
	{
		this.stateGroup.stateWithNameSetToTrue("Activated");
		return this;
	}

	activated(): boolean
	{
		return this.stateGroup.stateWithNameIsTrue("Activated");
	}

	deactivate(): Item
	{
		this.stateGroup.stateWithNameSetToFalse("Activated");
		return this;
	}
}

}
