
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Agent
{
	names: string[];
	descriptionAsPartOfPlace: string;
	descriptionWhenExamined: string;
	_scriptUpdateForTurn: Script;
	stateGroup : StateGroup;
	items: Item[];
	_commands: Command[];

	constructor
	(
		names: string[],
		descriptionAsPartOfPlace: string,
		descriptionWhenExamined: string,
		scriptUpdateForTurn: Script,
		stateGroup: StateGroup,
		items: Item[],
		commands: Command[]
	)
	{
		this.names = names;
		this.descriptionAsPartOfPlace = descriptionAsPartOfPlace;
		this.descriptionWhenExamined = descriptionWhenExamined;
		this._scriptUpdateForTurn = scriptUpdateForTurn;
		this.stateGroup = stateGroup || StateGroup.create();
		this.items = items || [];
		this._commands = commands || [];
	}

	static fromNameAndDescription(name: string, descriptionWhenExamined: string): Agent
	{
		return new Agent( [ name ], null, descriptionWhenExamined, null, null, null, null);
	}

	static fromNames(names: string[]): Agent
	{
		return new Agent(names, null, null, null, null, null, null);
	}

	static fromNamesAndDescription(names: string[], descriptionWhenExamined: string): Agent
	{
		return new Agent(names, null, descriptionWhenExamined, null, null, null, null);
	}

	static fromNamesDescriptionsAndScriptUpdateForTurnName
	(
		names: string[],
		descriptionAsPartOfPlace: string,
		descriptionWhenExamined: string,
		scriptUpdateForTurn: Script
	): Agent
	{
		return new Agent
		(
			names,
			descriptionAsPartOfPlace,
			descriptionWhenExamined,
			scriptUpdateForTurn,
			null, null, null
		);
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
		var command = Command.fromTextsAndScriptExecuteName(commandTexts, scriptName);
		return this.commandAdd(command);
	}

	descriptionAsPartOfPlaceSet(value: string): Agent
	{
		this.descriptionAsPartOfPlace = value;
		return this;
	}

	descriptionWhenExaminedSet(value: string): Agent
	{
		this.descriptionWhenExamined = value;
		return this;
	}

	goThroughPortal(portal: Portal, world: World): Agent
	{
		var placeThroughPortalName = portal.placeDestinationName;
		var placeThroughPortal = world.placeByName(placeThroughPortalName);
		var placeBeingDeparted = this.place(world);
		placeBeingDeparted.agentRemove(this, world);
		placeThroughPortal.agentAdd(this, world);
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

	scriptUpdateForTurn(): Script
	{
		return this._scriptUpdateForTurn;
	}

	scriptUpdateForTurnSet(value: Script): Agent
	{
		this._scriptUpdateForTurn = value;
		return this;
	}

	updateForTurn(universe: Universe, world: World, place: Place): void
	{
		var scriptUpdateForTurn = this.scriptUpdateForTurn();
		if (scriptUpdateForTurn != null)
		{
			scriptUpdateForTurn.run.call(scriptUpdateForTurn, universe, world, place, this, null);
		}

		this.items.forEach(x => x.updateForTurn(universe, world, place) );
	}

	// Clonable.

	clone(): Agent
	{
		return new Agent
		(
			this.names.map(x => x),
			this.descriptionAsPartOfPlace,
			this.descriptionWhenExamined,
			this._scriptUpdateForTurn.clone(),
			this.stateGroup.clone(),
			this.items.map(x => x.clone() ),
			this._commands.map(x => x.clone() )
		);
	}

	// Items.

	itemAdd(item: Item): void
	{
		var itemExisting = this.itemByName(item.name() );
		if (itemExisting == null)
		{
			this.items.push(item);
		}
		else
		{
			itemExisting.quantity += item.quantity;
		}
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
		Script.prototypesSet(instanceAsObject._scriptUpdateForTurn);
		instanceAsObject.items.forEach( (x: any) => Item.prototypesSet(x) );
		instanceAsObject.commands.forEach( (x: any) => Command.prototypesSet(x) );
	}

	// States.

	visible(): boolean { return true; }
}

}
