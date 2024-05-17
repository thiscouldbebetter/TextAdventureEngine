
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Place
{
	name: string;
	description: string;
	scriptUpdateForTurnName: string;
	portals: Portal[];
	emplacements: Emplacement[];
	items: Item[];
	agents: Agent[];
	stateGroup: StateGroup;

	constructor
	(
		name: string,
		description: string,
		scriptUpdateForTurnName: string,
		portals: Portal[],
		emplacements: Emplacement[],
		items: Item[],
		agents: Agent[],
		stateGroup: StateGroup
	)
	{
		this.name = name;
		this.description = description;
		this.scriptUpdateForTurnName = scriptUpdateForTurnName;
		this.portals = portals || [];
		this.emplacements = emplacements || [];
		this.items = items || [];
		this.agents = agents || [];
		this.stateGroup = stateGroup || new StateGroup([]);
	}

	static fromNameAndDescription(name: string, description: string): Place
	{
		return new Place
		(
			name,
			description,
			null,
			null,
			null,
			null,
			null,
			null
		);
	}

	static fromNameDescriptionAndObjects
	(
		name: string, description: string, objects: any[]
	): Place
	{
		return new Place
		(
			name,
			description,
			null, // scriptUpdateForTurnName
			objects.filter(x => x.constructor.name == Portal.name),
			objects.filter(x => x.constructor.name == Emplacement.name),
			objects.filter(x => x.constructor.name == Item.name),
			objects.filter(x => x.constructor.name == Agent.name),
			null // stateGroup
		);
	}

	static fromNameDescriptionAndScriptName
	(
		name: string,
		description: string,
		scriptUpdateForTurnName: string,
	): Place
	{
		return new Place
		(
			name,
			description,
			scriptUpdateForTurnName,
			null,
			null,
			null,
			null,
			null, // stateGroup
		);
	}

	static fromNameDescriptionScriptNameAndObjects
	(
		name: string,
		description: string,
		scriptUpdateForTurnName: string,
		objects: any[]
	): Place
	{
		return new Place
		(
			name,
			description,
			scriptUpdateForTurnName,
			objects.filter(x => x.constructor.name == Portal.name),
			objects.filter(x => x.constructor.name == Emplacement.name),
			objects.filter(x => x.constructor.name == Item.name),
			objects.filter(x => x.constructor.name == Agent.name),
			null, // stateGroup
		);
	}

	agentAdd(agent: Agent): void
	{
		this.agents.push(agent);
	}

	agentByName(name: string): Agent
	{
		return this.agents.find(x => x.names.indexOf(name) >= 0);
	}

	agentRemove(agent: Agent): void
	{
		this.agents.splice(this.agents.indexOf(agent), 1);
	}

	commands(): Command[]
	{
		var commandsAll = new Array<Command>();

		this.emplacements.forEach( x => commandsAll.push(...x.commands) );
		this.items.forEach( x => commandsAll.push(...x.commands) );
		this.agents.forEach( x => commandsAll.push(...x.commands() ) );

		return commandsAll;
	}

	draw(universe: Universe, world: World): string
	{
		var linesToWrite =
		[
			"Location: " + this.name
		];

		var hasBeenVisited = this.hasBeenVisited();
		if (hasBeenVisited == false)
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
				var objectIsVisible = objectToMention.visible();
				if (objectIsVisible)
				{
					var message =
						"There is "
						+ MessageHelper.Instance.wordPrefixedWithAOrAn(objectToMention.name() )
						+ " here.";
					linesToWrite.push(message);
				}
			}
		}

		var message = linesToWrite.join("\n\n") + "\n";

		return message;
	}

	emplacementAdd(emplacement: Emplacement): void
	{
		this.emplacements.push(emplacement);
	}

	emplacementByName(name: string): Emplacement
	{
		return this.emplacements.find(x => x.names.indexOf(name) >= 0);
	}

	emplacementRemove(emplacement: Emplacement): void
	{
		this.emplacements.splice(this.emplacements.indexOf(emplacement), 1);
	}

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

	objectByName(name: string): any
	{
		var objectFound = null;

		var objectArrays =
		[
			this.portals,
			this.emplacements,
			this.items,
			this.agents
		];

		var objectArray: any[] =
			objectArrays.find(oa => oa.some( (x: any) => x.name == name));

		if (objectArray != null)
		{
			objectFound = objectArray.find( (x: any) => x.name == name);
		}

		return objectFound;
	}

	portalByName(name: string): Portal
	{
		return this.portals.find(x => x.names.indexOf(name) >= 0);
	}

	region(world: World): Region
	{
		return world.regionByPlace(this);
	}

	scriptUpdateForTurn(world: World): Script
	{
		var script =
			this.scriptUpdateForTurnName == null
			? null
			: world.scriptByName(this.scriptUpdateForTurnName);
		return script;
	}

	updateForTurn(universe: Universe, world: World): void
	{
		var region = this.region(world);
		region.updateForTurn(universe, world);

		var scriptUpdateForTurn = this.scriptUpdateForTurn(world);
		if (scriptUpdateForTurn != null)
		{
			scriptUpdateForTurn.run(universe, world, this);
		}
	}

	// Clonable.

	clone(): Place
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
			this.stateGroup.clone()
		);
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, Place.prototype);
		instanceAsObject.portals.forEach( (x: any) => Portal.prototypesSet(x) );
		instanceAsObject.emplacements.forEach( (x: any) => Emplacement.prototypesSet(x) );
		instanceAsObject.items.forEach( (x: any) => Item.prototypesSet(x) );
		instanceAsObject.agents.forEach( (x: any) => Agent.prototypesSet(x) );
		StateGroup.prototypesSet(instanceAsObject.stateGroup);
	}

	// States.

	hasBeenVisited(): boolean
	{
		return (this.stateWithNameGetValue("Visited") == true);
	}

	stateWithNameGetValue(stateToGetName: string): any
	{
		return this.stateGroup.stateWithNameGetValue(stateToGetName);
	}

	stateWithNameIsTrue(stateName: string): boolean
	{
		return (this.stateWithNameGetValue(stateName) == true);
	}

	stateWithNameSetToValue(stateToSetName: string, valueToSet: any): Place
	{
		this.stateGroup.stateWithNameSetToValue(stateToSetName, valueToSet);
		return this;
	}

	stateWithNameSetToTrue(stateToSetName: string): Place
	{
		return this.stateWithNameSetToValue(stateToSetName, true);
	}

	visit(): void
	{
		return this.stateGroup.stateWithNameSetToValue("Visited", true);
	}
}

}
