
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
	)
	{
		this.name = name;
		this.description = description;
		this.scriptUpdateForTurnName = scriptUpdateForTurnName;
		this.portals = portals;
		this.emplacements = emplacements;
		this.items = items;
		this.agents = agents;
	}

	static fromNameAndDescription(name, description)
	{
		return new Place
		(
			name,
			description,
			null, // scriptUpdateForTurnName
			[], // portals
			[], // emplacements
			[], // items
			[], // agents
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

	agentAdd(agent)
	{
		this.agents.push(agent);
	}

	agentRemove(agent)
	{
		this.agents.splice(this.agents.indexOf(agent), 1);
	}

	draw(universe, world)
	{
		var linesToWrite =
		[
			"Location: " + this.name
		];

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

		universe.messageEnqueue(message);
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
			scriptUpdateForTurn.run(universe, world);
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
}
