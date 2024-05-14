
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Agent
{
	name: string;
	description: string;
	scriptUpdateForTurnName: string;
	items: Item[];
	commands: Command[];

	constructor
	(
		name: string,
		description: string,
		scriptUpdateForTurnName: string,
		items: Item[],
		commands: Command[]
	)
	{
		this.name = name;
		this.description = description;
		this.scriptUpdateForTurnName = scriptUpdateForTurnName;
		this.items = items || [];
		this.commands = commands || [];
	}

	static fromNameAndDescription(name: string, description: string): Agent
	{
		return new Agent(name, description, null, null, null);
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
			this.name,
			this.description,
			this.scriptUpdateForTurnName,
			this.items.map(x => x.clone() ),
			this.commands.map(x => x.clone() )
		);
	}

	// Items.

	itemAdd(item: Item): void
	{
		this.items.push(item);
	}

	itemByName(name: string): Item
	{
		return this.items.find(x => x.name == name);
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
