
class Emplacement
{
	constructor
	(
		name,
		description,
		scriptUseName,
		statesByName
	)
	{
		this.name = name;
		this.description = description;
		this._scriptUseName = scriptUseName;
		this._statesByName = statesByName || new Map();
	}

	static fromNameAndDescription(name, description)
	{
		return new Emplacement(name, description);
	}

	static fromNameDescriptionAndScriptUse(name, description, scriptUse)
	{
		return new Emplacement(name, description, scriptUse.name);
	}

	canBeUsed()
	{
		return (this._scriptUseName != null);
	}

	scriptUse(world)
	{
		return world.scriptByName(this._scriptUseName);
	}

	stateGetByName(name)
	{
		return this._statesByName.get(name);
	}

	stateWithNameSetToValue(name, value)
	{
		this._statesByName.set(name, value);
	}

	use(universe, world, place, target)
	{
		var scriptUse = this.scriptUse(world);
		if (scriptUse != null)
		{
			scriptUse.run(universe, world, place, this, target);
		}
	}

	// Clone.

	clone()
	{
		return new Emplacement
		(
			this.name,
			this.description,
			this.scriptUseName,
			this.statesByName // todo
		);
	}
}
