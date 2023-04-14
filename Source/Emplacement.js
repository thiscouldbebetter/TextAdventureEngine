
class Emplacement
{
	constructor(name, description, use, statesByName)
	{
		this.name = name;
		this.description = description;
		this._use = use;
		this._statesByName = statesByName || new Map();
	}

	canBeUsed()
	{
		return (this._use != null);
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
		if (this._use != null)
		{
			this._use(universe, world, place, this, target);
		}
	}
}
