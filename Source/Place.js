
class Place
{
	constructor
	(
		name,
		description,
		scriptUpdateForTurnName,
		portals,
		emplacements,
		items,
		agents,
		stateGroup
	)
	{
		this.name = name;
		this.description = description;
		this.scriptUpdateForTurnName = scriptUpdateForTurnName;
		this.portals = portals || [];
		this.emplacements = emplacements || [];
		this.items = items || [];
		this.agents = agents || [];
		this.stateGroup = stateGroup || new StateGroup();
	}

	static fromNameAndDescription(name, description)
	{
		return new Place
		(
			name,
			description,
		);
	}

	static fromNameDescriptionAndObjects(name, description, objects)
	{
		return new Place
		(
			name,
			description,
			null, // scriptUpdateForTurnName
			objects.filter(x => x.constructor.name == Portal.name),
			objects.filter(x => x.constructor.name == Emplacement.name),
			objects.filter(x => x.constructor.name == Item.name),
			objects.filter(x => x.constructor.name == Agent.name)
		);
	}

	static fromNameDescriptionScriptNameAndObjects
	(
		name, description, scriptUpdateForTurnName, objects
	)
	{
		return new Place
		(
			name,
			description,
			scriptUpdateForTurnName,
			objects.filter(x => x.constructor.name == Portal.name),
			objects.filter(x => x.constructor.name == Emplacement.name),
			objects.filter(x => x.constructor.name == Item.name),
			objects.filter(x => x.constructor.name == Agent.name)
		);
	}

	agentAdd(agent)
	{
		this.agents.push(agent);
	}

	agentByName(name)
	{
		return this.agents.find(x => x.name == name);
	}

	agentRemove(agent)
	{
		this.agents.splice(this.agents.indexOf(agent), 1);
	}

	commands()
	{
		var commandsAll = [];

		this.emplacements.forEach(x => commandsAll.push(...x.commands));
		this.items.forEach(x => commandsAll.push(...x.commands));
		this.agents.forEach(x => commandsAll.push(...x.commands));

		return commandsAll;
	}

	draw(universe, world)
	{
		var linesToWrite =
		[
			"Location: " + this.name
		];

		if (this.hasBeenVisited() == false)
		{
			linesToWrite.push(this.description);
		}

		this.visit(); // hack

		var objectArraysPresent =
		[
			this.emplacements,
			this.items,
			this.agents
		];

		for (var oa = 0; oa < objectArraysPresent.length; oa++)
		{
			var objects = objectArraysPresent[oa];
			for (var i = 0; i < objects.length; i++)
			{
				var objectToMention = objects[i];
				var message = "There is a " + objectToMention.name + " here.";
				linesToWrite.push(message);
			}
		}

		var message = linesToWrite.join("\n\n") + "\n";

		return message;
	}

	emplacementAdd(emplacement)
	{
		this.emplacements.push(emplacement);
	}

	emplacementRemove(emplacement)
	{
		this.emplacements.splice(this.emplacements.indexOf(emplacement), 1);
	}

	itemAdd(item)
	{
		this.items.push(item);
	}

	itemRemove(item)
	{
		this.items.splice(this.items.indexOf(item), 1);
	}

	objectByName(name)
	{
		var objectFound = null;

		var objectArrays =
		[
			this.portals,
			this.emplacements,
			this.items,
			this.agents
		];

		var objectArray =
			objectArrays.find(oa => oa.some(x => x.name == name));

		if (objectArray != null)
		{
			objectFound = objectArray.find(x => x.name == name);
		}

		return objectFound;
	}

	updateForTurn(universe, world)
	{
		if (this.scriptUpdateForTurnName != null)
		{
			var scriptUpdateForTurn =
				world.scriptByName(this.scriptUpdateForTurnName);
			scriptUpdateForTurn.run(universe, world, this);
		}
	}

	// Clonable.

	clone()
	{
		return new Place
		(
			this.name,
			this.description,
			this.scriptUpdateForTurnName,
			this.portals.map(x => x.clone()),
			this.emplacements.map(x => x.clone()),
			this.items.map(x => x.clone()),
			this.agents.map(x => x.clone()),
		);
	}

	// States.

	hasBeenVisited()
	{
		return (this.stateGroup.valueGetByName("Visited") == true);
	}

	visit()
	{
		return this.stateGroup.stateWithNameSetToValue("Visited", true);
	}
}
