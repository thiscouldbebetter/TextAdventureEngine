
class Emplacement
{
	constructor
	(
		name,
		description,
		scriptUseName,
		stateGroup
	)
	{
		this.name = name;
		this.description = description;
		this._scriptUseName = scriptUseName;
		this.stateGroup = stateGroup || new StateGroup();
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
			this.states.map(x => x.clone())
		);
	}
}
