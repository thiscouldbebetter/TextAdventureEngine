
class Emplacement
{
	constructor(name, description, use)
	{
		this.name = name;
		this.description = description;
		this._use = use;
	}

	canBeUsed()
	{
		return (this._use != null);
	}

	use(universe, world, place, target)
	{
		if (this._use != null)
		{
			this._use(universe, world, place, this, target);
		}
	}
}
