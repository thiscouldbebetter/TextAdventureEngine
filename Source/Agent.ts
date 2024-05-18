
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Agent
{
	names: string[];
	description: string;
	scriptUpdateForTurnName: string;
	stateGroup : StateGroup;
	items: Item[];
	_commands: Command[];

	constructor
	(
		names: string[],
		description: string,
		scriptUpdateForTurnName: string,
		stateGroup: StateGroup,
		items: Item[],
		commands: Command[]
	)
	{
		this.names = names;
		this.description = description;
		this.scriptUpdateForTurnName = scriptUpdateForTurnName;
		this.stateGroup = stateGroup || StateGroup.create();
		this.items = items || [];
		this._commands = commands || [];
	}

	static fromNameAndDescription(name: string, description: string): Agent
	{
		return new Agent( [ name ], description, null, null, null, null);
	}

	static fromNames(names: string[]): Agent
	{
		return new Agent(names, null, null, null, null, null);
	}

	commands(): Command[]
	{
		var commandsAll = new Array<Command>();
		this.items.forEach(x => commandsAll.push(...x.commands) );
		return commandsAll;
	}

	commandAdd(command: Command): Agent
	{
		this._commands.push(command);
		return this;
	}

	commandAddFromTextsAndScriptName(commandTexts: string[], scriptName: string): Agent
	{
		var command = new Command(commandTexts, scriptName);
		return this.commandAdd(command);
	}

	descriptionSet(value: string): Agent
	{
		this.description = value;
		return this;
	}

	itemsAdd(itemsToAdd: Item[]): Agent
	{
		this.items.push(...itemsToAdd);
		return this;
	}

	itemGetFromPlace(itemToGet: Item, place: Place): void
	{
		place.itemRemove(itemToGet);
		this.itemAdd(itemToGet);
	}

	name(): string
	{
		return this.names[0];
	}

	namesInclude(nameToMatch: string): boolean
	{
		return this.names.indexOf(nameToMatch) >= 0;
	}

	updateForTurn(universe: Universe, world: World, place: Place): void
	{
		if (this.scriptUpdateForTurnName != null)
		{
			var scriptUpdate = world.scriptByName(this.scriptUpdateForTurnName);
			scriptUpdate.run(universe, world, place, this);
		}

		this.items.forEach(x => x.updateForTurn());
	}

	// Clonable.

	clone(): Agent
	{
		return new Agent
		(
			this.names.map(x => x),
			this.description,
			this.scriptUpdateForTurnName,
			this.stateGroup.clone(),
			this.items.map(x => x.clone() ),
			this._commands.map(x => x.clone() )
		);
	}

	// Items.

	itemAdd(item: Item): void
	{
		this.items.push(item);
	}

	itemByName(name: string): Item
	{
		return this.items.find(x => x.names.indexOf(name) >= 0);
	}

	itemRemove(item: Item): void
	{
		this.items.splice(this.items.indexOf(item), 1);
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, Agent.prototype);
		instanceAsObject.items.forEach( (x: any) => Item.prototypesSet(x) );
		instanceAsObject.commands.forEach( (x: any) => Command.prototypesSet(x) );
	}

	// States.

	visible(): boolean { return true; }
}

}
