
class SaveState
{
	constructor(name, world)
	{
		this.name = name;
		this.world = world.clone();
	}
}