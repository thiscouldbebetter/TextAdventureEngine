
class Agent
{
	constructor
	(
		name,
		description,
		scriptUpdateForTurnName,
		items,
		commands
	)
	{
		this.name = name;
		this.description = description;
		this.scriptUpdateForTurnName = scriptUpdateForTurnName;
		this.items = items || [];
		this.commands = commands || [];
	}

	updateForTurn(universe, world, place)
	{
		if (this.scriptUpdateForTurnName != null)
		{
			var scriptUpdate = world.scriptByName(this.scriptUpdateForTurnName);
			scriptUpdate.run(universe, world, place, this);
		}

		this.items.forEach(x => x.updateForTurn());
	}

	// Clonable.

	clone()
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

	itemAdd(item)
	{
		this.items.push(item);
	}

	itemByName(name)
	{
		return this.items.find(x => x.name == name);
	}

	itemRemove(item)
	{
		this.items.splice(this.items.indexOf(item), 1);
	}

}
