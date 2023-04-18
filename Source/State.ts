
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class State
{
	name: string;
	value: string;

	constructor(name: string, value: string)
	{
		this.name = name;
		this.value = value;
	}

	// Clonable.

	clone(): State
	{
		return new State(this.name, this.value);
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, State.prototype);
	}
}

}
