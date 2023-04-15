
class Agent
{
	constructor(name, description, update)
	{
		this.name = name;
		this.description = description;
		this.update = update;
	}

	// Clonable.

	clone()
	{
		return new Agent
		(
			this.name,
			this.description,
			this.update // todo
		);
	}
}
