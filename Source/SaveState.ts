
class SaveState
{
	name: string;
	world: World;

	constructor(name: string, world: World)
	{
		this.name = name;
		this.world = world.clone();
	}

	// Serialization.

	static fromString(saveStateAsString: string): SaveState
	{
		var saveState = JSON.parse(saveStateAsString);
		SaveState.prototypesSet(saveState);
		return saveState;
	}

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, SaveState.prototype);
		World.prototypesSet(instanceAsObject.world);
	}

	toString(): string
	{
		return JSON.stringify(this);
	}
}
