
class Program
{
	main(): void
	{
		var worldCreate = () => Game.worldBuild();
		var universe = Universe.fromWorldCreate(worldCreate);
		universe.initialize();
	}
}
