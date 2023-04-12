
class Item
{
	constructor(name, description, use, update)
	{
		this.name = name;
		this.description = description;
		this._use = use;
		this._update = update;
	}

	canBeUsed()
	{
		return (this._use != null);
	}

	update()
	{
		if (this._update != null)
		{
			this._update();
		}
	}

	use(universe, world, place, target)
	{
		if (this._use != null)
		{
			this._use(universe, world, place, this, target);
		}
	}
}
