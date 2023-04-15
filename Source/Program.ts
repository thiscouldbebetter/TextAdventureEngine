
class Program
{
	main(): void
	{
		var worldCreate = () => Game.worldBuild();
		var universe = new Universe(worldCreate);
		universe.initialize();
		//universe.update();
	}
}
