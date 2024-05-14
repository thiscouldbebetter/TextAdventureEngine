
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Item
{
	name: string;
	description: string;
	_scriptUseName: string;
	stateGroup: StateGroup;
	commands: Command[];

	constructor
	(
		name: string,
		description: string,
		scriptUseName: string,
		stateGroup: StateGroup,
		commands: Command[]
	)
	{
		this.name = name;
		this.description = description;
		this._scriptUseName = scriptUseName;
		this.stateGroup = stateGroup || new StateGroup([]);
		this.commands = commands || [];
	}

	static fromNameAndDescription(name: string, description: string): Item
	{
		return new Item(name, description, null, null, null);
	}

	static fromNameDescriptionAndScriptUse
	(
		name: string, description: string, scriptUse: Script
	): Item
	{
		return new Item(name, description, scriptUse.name, null, null);
	}

	static fromNameDescriptionAndScriptUseName
	(
		name: string, description: string, scriptUseName: string
	): Item
	{
		return new Item(name, description, scriptUseName, null, null);
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
			this.name,
			this.description,
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
