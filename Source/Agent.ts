
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

	static fromNamesAndDescription(names: string[], description: string): Agent
	{
		return new Agent(names, description, null, null, null, null);
	}

	commands(): Command[]
	{
		var commandsAll = new Array<Command>();
		commandsAll.push(...this._commands);
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

	name(): string
	{
		return this.names[0];
	}

	namesInclude(nameToMatch: string): boolean
	{
		return this.names.indexOf(nameToMatch) >= 0;
	}

	place(world: World): Place
	{
		return world.placeContainingAgent(this);
	}

	updateForTurn(universe: Universe, world: World, place: Place): void
	{
		if (this.scriptUpdateForTurnName != null)
		{
			var scriptUpdate = world.scriptByName(this.scriptUpdateForTurnName);
			scriptUpdate.run(universe, world, place, this);
		}

		this.items.forEach(x => x.updateForTurn(universe, world, place) );
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

	itemDropQuantityIntoPlace
	(
		itemToDrop: Item,
		quantityToDrop: number,
		place: Place
	): void
	{
		var itemToDrop =
			this.itemRemoveQuantity(itemToDrop, quantityToDrop);
		if (itemToDrop != null)
		{
			place.itemAdd(itemToDrop);
		}
	}

	itemGetFromPlace(itemToGet: Item, place: Place): void
	{
		place.itemRemove(itemToGet);
		this.itemAdd(itemToGet);
	}
	
	itemsAdd(itemsToAdd: Item[]): Agent
	{
		this.items.push(...itemsToAdd);
		return this;
	}

	itemRemove(item: Item): void
	{
		this.items.splice(this.items.indexOf(item), 1);
	}

	itemRemoveQuantity(itemToRemoveFrom: Item, quantityToRemove: number): Item
	{
		var itemRemoved: Item;

		var itemQuantityBefore = itemToRemoveFrom.quantity;
		if (itemQuantityBefore < quantityToRemove)
		{
			itemRemoved = null;
		}
		else
		{
			itemRemoved = itemToRemoveFrom.clone().quantitySet(quantityToRemove);
			itemToRemoveFrom.quantity -= quantityToRemove;
			if (itemToRemoveFrom.quantity <= 0)
			{
				this.itemRemove(itemToRemoveFrom);
			}
		}

		return itemRemoved;
	}

	itemWithNameRemove(name: string): Agent
	{
		var itemToRemove = this.itemByName(name);

		if (itemToRemove != null)
		{
			this.itemRemove(itemToRemove);
		}

		return this;
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
