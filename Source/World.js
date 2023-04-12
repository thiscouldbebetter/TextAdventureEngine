
class World
{
	constructor(name, places, player, commands)
	{
		this.name = name;
		this.places = places;
		this.player = player;
		this.commands = commands;

		this.ticksSoFar = 0;
		this.placeCurrentName = this.places[0].name;
	}

	placeByName(name)
	{
		return this.places.find(x => x.name == name);
	}

	placeCurrent()
	{
		return this.placeByName(this.placeCurrentName);
	}

	placeCurrentSet(value)
	{
		this.placeCurrentName = value.name;
	}

	update(universe)
	{
		var commandText = universe.commandEnteredAsText;

		if (commandText != null)
		{
			var commandRecognized =
				Command.fromTextAndCommands(commandText, this.commands);
			if (commandRecognized != null)
			{
				commandRecognized.execute(universe, this, null);
			}
		}

		if (universe.world != null)
		{
			this.player.update(universe, this);

			var placeCurrent = this.placeCurrent();
			placeCurrent.update(universe, this);
		}
	}
}
