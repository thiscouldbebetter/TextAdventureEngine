
class Command
{
	constructor(text, execute)
	{
		this.text = text;
		this._execute = execute;
	}

	static fromTextAndCommands(commandTextToMatch, commands)
	{
		var commandsMatching =
			commands.filter(x => commandTextToMatch.startsWith(x.text) );

		var commandMatching;
		if (commandsMatching.length == 0)
		{
			commandMatching = Command.unrecognized(commandTextToMatch);
		}
		else
		{
			commandMatching = commandsMatching[commandsMatching.length - 1];
			commandMatching = commandMatching.clone();
			commandMatching.textSet(commandTextToMatch);
		}

		return commandMatching;
	}

	static unrecognized(text)
	{
		return new Command
		(
			text,
			(u) => u.console.writeLine("Unrecognized command: '" + text + "'.")
		);
	}

	static Instances()
	{
		if (Command._instances == null)
		{
			Command._instances = new Command_Instances();
		}
		return Command._instances;
	}

	clone()
	{
		return new Command(this.text, this._execute);
	}

	execute(universe, world, place)
	{
		var console = universe.console;
		console.writeLine("Command entered: " + this.text);
		console.writeLine();
		this._execute(universe, world, place);
		console.writeLine("");
	}

	textSet(value)
	{
		this.text = value;
		return this;
	}
}

class Command_Instances
{
	constructor()
	{
		this.DropSomething = new Command
		(
			"drop ",
			this.dropSomething
		);

		this.GetSomething = new Command
		(
			"get ",
			this.getSomething
		);

		this.GoSomewhere = new Command
		(
			"go ",
			this.goSomewhere
		);

		this.Help = new Command
		(
			"?",
			this.help
		);

		this.InventoryView = new Command
		(
			"inventory",
			this.inventoryView
		);

		this.LookAround = new Command
		(
			"look",
			this.lookAround
		);

		this.LookAtSomething = new Command
		(
			"look ",
			this.lookAtSomething
		);

		this.Quit = new Command
		(
			"quit",
			this.quit
		);

		this.TalkToSomething = new Command
		(
			"talk to ",
			this.talkToSomething
		);

		this.UseSomething = new Command
		(
			"use ",
			this.useSomething
		);

		this.Wait = new Command
		(
			"wait",
			this.wait
		);

		this._All =
		[
			this.DropSomething,
			this.GetSomething,
			this.GoSomewhere,
			this.Help,
			this.InventoryView,
			this.LookAround,
			this.LookAtSomething,
			this.Quit,
			this.TalkToSomething,
			this.UseSomething,
			this.Wait
		];

		this._AllByName = new Map(this._All.map(x => [x.name, x] ) )
	}

	dropSomething(universe, world, place)
	{
		var commandText = this.text;
		var targetName = commandText.substr(commandText.indexOf(" ") + 1);
		var message = null;

		var player = world.player;
		var itemToDrop = player.items.find(x => x.name == targetName);
		if (itemToDrop == null)
		{
			message = "You don't have any " + targetName + ".";
		}
		else
		{
			message = "You drop the " + itemToDrop.name + ".";
			player.itemRemove(itemToDrop);
			place = world.placeCurrent();
			place.itemAdd(itemToDrop);
		}

		universe.console.writeLine(message);
	}

	getSomething(universe, world, place)
	{
		var commandText = this.text;
		var targetName = commandText.substr(commandText.indexOf(" ") + 1);
		var message = null;

		place = world.placeCurrent();

		var emplacementToGet = place.emplacements.find(x => x.name == targetName);
		if (emplacementToGet != null)
		{
			message = "The " + emplacementToGet.name + " cannot be picked up.";
		}
		else 
		{
			var agentToGet = place.agents.find(x => x.name == targetName);
			if (agentToGet != null)
			{
				message = "The " + agentToGet.name + " cannot be picked up.";
			}
			else
			{
				var player = world.player;

				var itemToGet = place.items.find(x => x.name == targetName);
				if (itemToGet == null)
				{
					var itemAlreadyCarried = player.itemByName(targetName);
					if (itemAlreadyCarried == null)
					{
						message = "You don't see any " + targetName + " here.";
					}
					else
					{
						message = "You're already carrying the " + targetName + ".";
					}
				}
				else
				{
					message = "You take the " + itemToGet.name + ".";
					place.itemRemove(itemToGet);
					world.player.itemAdd(itemToGet);
				}
			}
		}

		universe.console.writeLine(message);
	}

	goSomewhere(universe, world, place)
	{
		place = world.placeCurrent();
		var portals = place.portals;
		var commandText = this.text;
		var portalNameFromCommand =
			commandText.substr(commandText.indexOf(" ") + 1);
		var portalMatchingName =
			portals.find(x => x.name == portalNameFromCommand);
		var console = universe.console;
		if (portalMatchingName == null)
		{
			console.writeLine
			(
				"Unrecognized exit: '" + portalNameFromCommand + "'."
			);
		}
		else
		{
			var placeNextName = portalMatchingName.placeDestinationName;
			var placeNext = world.placeByName(placeNextName);
			world.placeCurrentSet(placeNext);
			console.writeLine(placeNext.description);
		}
	}

	help(universe, world, place)
	{
		var helpTextAsLines =
		[
			"To play, type a command and press the Enter key.",
			"",
			"Recognized commands include:",
			"",
			"? - This text is displayed.",
			"look - The player examines the surroundings.",
			"look <name> - The player examines a particular thing.",
			"go <name> - The player attempts to leave the area by the specified exit.",
			"get <name> - The player attempts to pick up the item named.",
			"inventory - Displays a list of the player's possessions.",
			"quit - Quit the Command_Instances.",
			"talk to <name> - The player attempts to talk to someone or something.",
			"use <name> - The player attempts to use something.",
			"use <name> on <name2> - The player attempts to use something on something.",
			"wait - The player does nothing, and simply waits for something to happen."
		];
		var console = universe.console;
		console.writeLines(helpTextAsLines);
	}

	inventoryView(universe, world, place)
	{
		var player = world.player;
		var items = player.items;
		var linesToWrite =
		[
			"Items Carried:"
		];
		items.forEach(x => linesToWrite.push(x.name) );
		universe.console.writeLines(linesToWrite);
	}

	lookAround(universe, world, place)
	{
		place = world.placeCurrent();
		universe.console.writeLine(place.description);
	}

	lookAtSomething(universe, world, place)
	{
		var commandText = this.text;
		var targetName = commandText.substr(commandText.indexOf(" ") + 1);
		var targetDescription = null;

		var player = world.player;
		var playerItems = player.items;

		place = world.placeCurrent();

		var targetsPossibleArrays =
		[
			playerItems,
			place.portals,
			place.emplacements,
			place.items,
			place.agents
		];

		for (var ta = 0; ta < targetsPossibleArrays.length; ta++)
		{
			var targetsPossible = targetsPossibleArrays[ta];

			for (var i = 0; i < targetsPossible.length; i++)
			{
				var targetFound =
					targetsPossible.find(x => x.name == targetName);
				if (targetFound != null)
				{
					targetDescription = targetFound.description;
					break;
				}
			}

			if (targetDescription != null)
			{
				break;
			}
		}

		if (targetDescription == null)
		{
			targetDescription = "You don't see any " + targetName + " here.";
		}

		universe.console.writeLine(targetDescription);
	}

	quit(universe, world, place)
	{
		universe.console.writeLine("Quitting.");

		universe.world = null;
	}

	talkToSomething(universe, world, place)
	{
		var message = null;

		var commandText = this.text;

		var targetName = commandText.substr("talk to ".length);

		place = world.placeCurrent();

		var emplacementToTalkTo = place.emplacements.find(x => x.name == targetName);
		if (emplacementToTalkTo != null)
		{
			message = "The " + emplacementToTalkTo.name + " says nothing.";
		}
		else 
		{
			var itemToTalkTo = place.items.find(x => x.name == targetName);
			if (itemToTalkTo != null)
			{
				message = "The " + itemToTalkTo.name + " says nothing.";
			}
			else
			{
				var agentToTalkTo = place.agents.find(x => x.name == targetName);
				if (agentToTalkTo == null)
				{
					message = "You don't see any " + targetName + " here.";
				}
				else
				{
					message = "The " + agentToTalkTo.name + " says nothing.";
				}
			}
		}

		universe.console.writeLine(message);
	}

	useSomething(universe, world, place)
	{
		var message = null;

		var commandText = this.text;

		var objectName;
		var textOn = " on ";
		var indexOfOn = commandText.indexOf(" on ");
		if (indexOfOn < 0)
		{
			objectName = commandText.substring("use ".length);
		}
		else
		{
			objectName = commandText.substr(0, indexOfOn).split(" ")[1];
		}

		var objectToUse = null;

		place = world.placeCurrent();

		var emplacementToUse = place.emplacements.find(x => x.name == objectName);
		if (emplacementToUse != null)
		{
			objectToUse = emplacementToUse;
		}
		else 
		{
			var agentToUse = place.agents.find(x => x.name == objectName);
			if (agentToUse != null)
			{
				message = "The " + agentToUse.name + " cannot be used.";
			}
			else
			{
				var playerItems = world.player.items;
				var itemCarriedToUse =
					playerItems.find(x => x.name == objectName);

				if (itemCarriedToUse != null)
				{
					objectToUse = itemCarriedToUse;
				}
				else
				{
					var itemInRoomToUse =
						place.items.find(x => x.name == objectName);

					if (itemInRoomToUse == null)
					{
						message = "You don't see any " + objectName + " here.";
					}
					else
					{
						objectToUse = itemInRoomToUse;
					}
				}
			}
		}

		var console = universe.console;
		if (objectToUse == null)
		{
			console.writeLine(message);
		}
		else if (objectToUse.canBeUsed() == false)
		{
			message = "The " + objectToUse.name + " cannot be used.";
			console.writeLine(message);
		}
		else
		{
			var target = null;
			if (indexOfOn >= 0)
			{
				var targetToUseObjectOnName =
					commandText.substr(indexOfOn + textOn.length);
				if (targetToUseObjectOnName != null)
				{
					var player = world.player;
					target = player.itemByName(targetToUseObjectOnName);
					if (target == null)
					{
						target = place.objectByName(targetToUseObjectOnName);
						if (target == null)
						{
							console.writeLine
							(
								"You don't see any " + targetToUseObjectOnName + " here."
							);
							objectToUse = null;
						}
					}
				}
			}

			if (objectToUse != null)
			{
				if (target == objectToUse)
				{
					console.writeLine("That cannot be used on itself!");
				}
				else
				{
					objectToUse.use(universe, world, place, target);
				}
			}
		}
	}

	wait(universe, world, place)
	{
		universe.console.writeLine("You wait a moment.");
	}

}
