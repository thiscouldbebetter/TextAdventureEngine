
class SaveStateManager
{
	universe: Universe;
	saveStates: SaveState[];

	constructor(universe: Universe)
	{
		this.universe = universe;

		this.saveStates = new Array<SaveState>();
	}

	saveStateDeleteByName(stateName: string): void
	{
		if (this.saveStates.some(x => x.name == stateName) == false)
		{
			throw new Error("No saved state was found with name '" + stateName + "'.");
		}
		else
		{
			var saveState = this.saveStates.find(x => x.name == stateName);
			this.saveStates.splice(this.saveStates.indexOf(saveState), 1);
		}
	}

	saveStateLoadByName(stateName: string): void
	{
		if (this.saveStates.some(x => x.name == stateName) == false)
		{
			throw new Error("No saved state was found with name '" + stateName + "'.");
		}
		else
		{
			var state = this.saveStates.find(x => x.name == stateName);
			var worldToLoad = state.world.clone();
			this.universe.world = worldToLoad;
		}
	}

	saveStateNamesGet(): string[]
	{
		return this.saveStates.map(x => x.name);
	}

	saveStateSave(saveStateToSave: SaveState): void
	{
		var stateName = saveStateToSave.name;

		if (this.saveStates.some(x => x.name == stateName) )
		{
			throw new Error
			(
				"Could not save, because an existing saved state was found with name '" + stateName + "'."
			);
		}
		else
		{
			this.saveStates.push(saveStateToSave);
		}
	}
}
