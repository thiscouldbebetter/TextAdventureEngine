
class World
{
	constructor
	(
		name,
		places,
		player,
		commands,
		scripts,
		turnsSoFar,
		placeCurrentName
	)
	{
		this.name = name;
		this.places = places;
		this.player = player;
		this.commands = commands;
		this.scripts = scripts;
		this.turnsSoFar = turnsSoFar || 0;
		this.placeCurrentName = placeCurrentName || this.places[0].name;

		this.isOver = false;
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

	scriptAdd(script)
	{
		this.scripts.push(script);
	}

	scriptByName(name)
	{
		return this.scripts.find(x => x.name == name);
	}

	updateForUniverseAndCommandText(universe, commandText)
	{
		var console = universe.console;
		console.clear();

		if (commandText != null)
		{
			var commandRecognized =
				Command.fromTextAndCommands(commandText, this.commands);
			if (commandRecognized != null)
			{
				if (this.isOver)
				{
					if
					(
						commandText.startsWith("restore ") == false
						&& commandText != "restart"
					)
					{
						var message =
							"The game is over.  You can't do anything but restore or restart.\n";
						console.writeLine(message);
						commandRecognized = null;
					}
				}

				if (commandRecognized != null)
				{
					commandRecognized.execute(universe, this, null);
				}
			}

		}

		var world = universe.world; // Can't use "this" anymore: the command might have changed it.

		if (world != null)
		{
			world.player.update(universe, this);

			var placeCurrent = world.placeCurrent();
			placeCurrent.update(universe, world);

			placeCurrent.draw(universe, world);
		}
	}

	// Clonable.

	clone()
	{
		return new World
		(
			this.name,
			this.places.map(x => x.clone()),
			this.player.clone(),
			this.commands.map(x => x.clone()),
			this.scripts.map(x => x.clone()),
			this.placeCurrentName,
			this.turnsSoFar
		);
	}
}
