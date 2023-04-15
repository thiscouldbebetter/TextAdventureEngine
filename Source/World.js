
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
		universe.console.clear();

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

			placeCurrent.draw(universe, this);
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
