
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class SaveStateManager
{
	universe: Universe;
	storageManager: StorageManager2;

	constructor
	(
		universe: Universe,
		storageManager: StorageManager2
	)
	{
		this.universe = universe;
		this.storageManager = storageManager;
	}

	static delimiter()
	{
		return "|";
	}

	static storageManagerKeyForSaveStateList()
	{
		var delimiter = SaveStateManager.delimiter();
		return delimiter + "SaveStateNameList";
	}

	saveStateDeleteByName(stateName: string): void
	{
		if (this.storageManager.valueExistsForKey(stateName) == false)
		{
			throw new Error
			(
				"No saved state was found with name '" + stateName + "'."
			);
		}
		else
		{
			this.storageManager.valueDeleteByKey(stateName);
		}
	}

	saveStateLoadByName(stateName: string): void
	{
		if (this.storageManager.valueExistsForKey(stateName) == false)
		{
			throw new Error
			(
				"No saved state was found with name '" + stateName + "'."
			);
		}
		else
		{
			var stateAsString = this.storageManager.valueGetByKey(stateName);
			var state = SaveState.fromString(stateAsString);
			var worldToLoad = state.world.clone();
			this.universe.world = worldToLoad;
		}
	}

	saveStateNamesGet(): string[]
	{
		var saveStateNamesAsString = this.storageManager.valueGetByKey
		(
			SaveStateManager.storageManagerKeyForSaveStateList()
		);
		var delimiter = SaveStateManager.delimiter();
		var saveStateNames = saveStateNamesAsString.split(delimiter);
		return saveStateNames;
	}

	saveStateSave(saveStateToSave: SaveState): void
	{
		var stateName = saveStateToSave.name;

		var delimiter = SaveStateManager.delimiter();
		if (stateName.indexOf(delimiter) >= 0)
		{
			throw new Error
			(
				"Save state names may not include the character '" + delimiter + "."
			);
		}

		if (this.storageManager.valueExistsForKey(stateName) )
		{
			throw new Error
			(
				"Could not save, because an existing saved state was found with name '" + stateName + "'."
			);
		}
		else
		{
			var saveStateAsString = saveStateToSave.toString();
			this.storageManager.keyAndValueSave(stateName, saveStateAsString);
		}
	}
}

}
