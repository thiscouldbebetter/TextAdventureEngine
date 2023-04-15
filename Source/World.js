
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
						commandText.startsWith("load ") == false
						&& commandText != "restart"
					)
					{
						var message =
							"The game is over.  You can't do anything but load or restart.\n";
						universe.messageEnqueue(message);
						commandRecognized = null;
					}
				}

				if (commandRecognized != null)
				{
					commandRecognized.execute(universe, this, null);
					universe.messageEnqueue("");
				}
			}
		}

		var world = universe.world; // Can't use "this" anymore: the command might have changed it.

		world.player.updateForTurn(universe, this);

		var placeCurrent = world.placeCurrent();
		placeCurrent.updateForTurn(universe, world);

		var messageForPlaceCurrent = placeCurrent.draw(universe, world);
		universe.messageEnqueue(messageForPlaceCurrent);

		universe.console.clear();

		var messageQueue = universe.messageQueue;
		while (messageQueue.hasMessages())
		{
			var message = messageQueue.dequeue();
			universe.console.writeLine(message);
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
