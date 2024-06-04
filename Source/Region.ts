
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Region
{
	name: string;
	scriptUpdateForTurnName: string;
	stateGroup: StateGroup;
	places: Place[];
	agents: Agent[];

	constructor
	(
		name: string,
		scriptUpdateForTurnName: string,
		stateGroup: StateGroup,
		places: Place[],
		agents: Agent[]
	)
	{
		this.name = name;
		this.scriptUpdateForTurnName = scriptUpdateForTurnName;
		this.stateGroup = stateGroup || StateGroup.create();
		this.places = places;
		this.agents = agents || [];

		this.places.forEach(x => this.agents.push(...x.agents) );
	}

	static fromNameAndPlaces(name: string, places: Place[])
	{
		return new Region(name, null, null, places, null);
	}

	static fromNameScriptUpdateForTurnNameAndPlaces
	(
		name: string, scriptUpdateForTurnName: string, places: Place[]
	)
	{
		return new Region(name, scriptUpdateForTurnName, null, places, null);
	}

	agentAdd(agentToAdd: Agent): Region
	{
		this.agents.push(agentToAdd);
		return this;
	}

	agentByName(name: string): Agent
	{
		return this.agents.find(x => x.namesInclude(name) );
	}

	agentRemove(agentToRemove: Agent): Region
	{
		this.agents.splice(this.agents.indexOf(agentToRemove), 1);
		return this;
	}

	placeByName(placeName: string): Place
	{
		return this.places.find(x => x.name == placeName);
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
		var scriptUpdateForTurn = this.scriptUpdateForTurn(world);
		if (scriptUpdateForTurn != null)
		{
			var placeCurrent = world.placeCurrent();
			scriptUpdateForTurn.run(universe, world, placeCurrent, null, null);
		}

		for (var i = 0; i < this.agents.length; i++)
		{
			var agent = this.agents[i];
			var agentPlace = agent.place(world);
			agent.updateForTurn(universe, world, agentPlace);
		}
	}

	// Clonable.

	clone(): Region
	{
		return new Region
		(
			this.name,
			this.scriptUpdateForTurnName,
			this.stateGroup.clone(),
			this.places.map(x => x.clone() ),
			this.agents.map(x => x.clone() )
		);
	}
}

}