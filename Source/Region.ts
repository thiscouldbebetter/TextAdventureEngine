
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Region
{
	name: string;
	scriptUpdateForTurnName: string;
	stateGroup: StateGroup;
	places: Place[];

	constructor
	(
		name: string,
		scriptUpdateForTurnName: string,
		stateGroup: StateGroup,
		places: Place[]
	)
	{
		this.name = name;
		this.scriptUpdateForTurnName = scriptUpdateForTurnName;
		this.stateGroup = stateGroup || StateGroup.create();
		this.places = places;
	}

	static fromNameAndPlaces(name: string, places: Place[])
	{
		return new Region(name, null, null, places);
	}

	static fromNameScriptUpdateForTurnNameAndPlaces
	(
		name: string, scriptUpdateForTurnName: string, places: Place[]
	)
	{
		return new Region(name, scriptUpdateForTurnName, null, places);
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
			var place = world.placeCurrent();
			scriptUpdateForTurn.run(universe, world, place);
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
			this.places.map(x => x.clone() )
		);
	}
}

}