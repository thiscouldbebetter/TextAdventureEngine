
class Player
{
	constructor(name, items)
	{
		this.name = name;
		this.items = items;
	}

	itemAdd(item)
	{
		this.items.push(item);
	}

	itemByName(name)
	{
		return this.items.find(x => x.name == name);
	}

	itemRemove(item)
	{
		this.items.splice(this.items.indexOf(item), 1);
	}

	update()
	{
		this.items.forEach(x => x.update());
	}
}
