
class State
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
}
