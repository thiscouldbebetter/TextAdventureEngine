
class Command
{
	constructor(text, scriptExecuteName)
	{
		this.text = text;
		this.scriptExecuteName = scriptExecuteName;
	}

	static fromTextAndScriptExecute(text, scriptExecute)
	{
		var returnValue =
			new Command(text, scriptExecute.name);
		returnValue._scriptExecute = scriptExecute;
		return returnValue;
	}

	static fromTextAndCommands(commandTextToMatch, commands)
	{
		var commandsMatching =
			commands.filter(x => commandTextToMatch.startsWith(x.text) );

		var commandMatching;
		if (commandsMatching.length == 0)
		{
			commandMatching = commands.find(x => x.text == "unrecognized");
			commandMatching = commandMatching.clone().textSet(commandTextToMatch);
		}
		else
		{
			commandMatching = commandsMatching[0];
			commandMatching = commandMatching.clone();
			commandMatching.textSet(commandTextToMatch);
		}

		return commandMatching;
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
		return Command.fromTextAndScriptExecute
		(
			this.text, this._scriptExecute
		);
	}

	scriptExecute(world)
	{
		return world.scriptByName(this.scriptExecuteName);
	}

	execute(universe, world, place, command)
	{
		var console = universe.console;
		console.writeLine("Command entered: " + this.text);
		console.writeLine();
		var scriptExecute = this.scriptExecute(world);
		scriptExecute.run(universe, world, place, this);
		console.writeLine("");
	}

	textSet(value)
	{
		this.text = value;
		return this;
	}

	// Clonable.

	clone()
	{
		return new Command
		(
			this.text,
			this.scriptExecuteName
		);
	}
}

class Command_Instances
{
	constructor()
	{
		this.DropSomething = Command.fromTextAndScriptExecute
		(
			"drop ",
			new Script("DropSomething", this.dropSomething)
		);

		this.StateDelete = Command.fromTextAndScriptExecute
		(
			"delete ",
			new Script("StateDelete", this.stateDelete)
		);

		this.StateLoad = Command.fromTextAndScriptExecute
		(
			"load ",
			new Script("StateLoad", this.stateLoad)
		);

		this.StateSave = Command.fromTextAndScriptExecute
		(
			"save ",
			new Script("StateSave", this.stateSave)
		);

		this.StatesList = Command.fromTextAndScriptExecute
		(
			"list saves",
			new Script("StatesList", this.statesList)
		);

		this.GetSomething = Command.fromTextAndScriptExecute
		(
			"get ",
			new Script("GetSomething", this.getSomething)
		);

		this.GoSomewhere = Command.fromTextAndScriptExecute
		(
			"go ",
			new Script("GoSomewhere", this.goSomewhere)
		);

		this.Help = Command.fromTextAndScriptExecute
		(
			"?",
			new Script("Help", this.help)
		);

		this.InventoryView = Command.fromTextAndScriptExecute
		(
			"inventory",
			new Script("InventoryView", this.inventoryView)
		);

		this.LookAround = Command.fromTextAndScriptExecute
		(
			"look around",
			new Script("LookAround", this.lookAround)
		);

		this.LookAtSomething = Command.fromTextAndScriptExecute
		(
			"look at ",
			new Script("LookAtSomething", this.lookAtSomething)
		);

		this.LookSomewhere = Command.fromTextAndScriptExecute
		(
			"look ",
			new Script("LookSomewhere", this.lookAtSomething) // hack
		);

		this.Quit = Command.fromTextAndScriptExecute
		(
			"quit",
			new Script("Quit", this.quit)
		);

		this.TalkToSomething = Command.fromTextAndScriptExecute
		(
			"talk to ",
			new Script("TalkToSomething", this.talkToSomething)
		);

		this.Unrecognized = Command.fromTextAndScriptExecute
		(
			"unrecognized",
			new Script("Unrecognized", this.unrecognized)
		);

		this.UseSomething = Command.fromTextAndScriptExecute
		(
			"use ",
			new Script("UseSomething", this.useSomething)
		);

		this.Wait = Command.fromTextAndScriptExecute
		(
			"wait",
			new Script("Wait", this.wait)
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
			this.LookSomewhere,
			this.Quit,
			this.StateDelete,
			this.StateSave,
			this.StateLoad,
			this.StatesList,
			this.TalkToSomething,
			this.Unrecognized,
			this.UseSomething,
			this.Wait
		];

		this._AllByName = new Map(this._All.map(x => [x.name, x] ) )
	}

	dropSomething(universe, world, place, command)
	{
		var commandText = command.text;
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

	getSomething(universe, world, place, command)
	{
		var commandText = command.text;
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

	goSomewhere(universe, world, place, command)
	{
		place = world.placeCurrent();
		var portals = place.portals;
		var commandText = command.text;
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

	help(universe, world, place, command)
	{
		var helpTextAsLines =
		[
			"To play, type a command and press the Enter key.",
			"",
			"Recognized commands include:",
			"",
			"? - This text is displayed.",
			"delete <name> - Deletes the specified saved game.",
			"look around - The player examines the surroundings.",
			"look <name>, look at <name> - The player examines a particular thing.",
			"go <name> - The player attempts to leave the area by the specified exit.",
			"get <name> - The player attempts to pick up the item named.",
			"inventory - Displays a list of the player's possessions.",
			"list saves - Lists saved game states.",
			"quit - Quit the game.",
			"load <name> - Loads the saved game with the specified name.",
			"save <name> - Saves the game using the specified name.",
			"talk to <name> - The player attempts to talk to someone or something.",
			"use <name> - The player attempts to use something.",
			"use <name> on <name2> - The player attempts to use something on something.",
			"wait - The player does nothing, and simply waits for something to happen."
		];
		var console = universe.console;
		console.writeLines(helpTextAsLines);
	}

	inventoryView(universe, world, place, command)
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

	lookAround(universe, world, place, command)
	{
		place = world.placeCurrent();
		universe.console.writeLine(place.description);
	}

	lookAtSomething(universe, world, place, command)
	{
		var commandText = command.text;
		var textAt = " at ";
		var indexOfAt = commandText.indexOf(textAt);
		var targetName;
		if (indexOfAt < 0)
		{
			targetName =
				commandText.substr(commandText.indexOf(" ") + 1);
		}
		else
		{
			targetName =
				commandText.substr(indexOfAt + textAt.length);
		}

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

	quit(universe, world, place, command)
	{
		universe.console.writeLine("Quitting.");

		universe.world = null;
	}

	stateDelete(universe, world, place, command)
	{
		var commandText = command.text;
		var stateName = commandText.substr(commandText.indexOf(" ") + 1);
		var saveStateManager = universe.saveStateManager;
		try
		{
			saveStateManager.saveStateDeleteByName(stateName);
			universe.console.writeLine("Deleted state with name '" + stateName + "'.");
		}
		catch (ex)
		{
			universe.console.writeLine(ex.message);
		}
	}

	stateLoad(universe, world, place, command)
	{
		var commandText = command.text;
		var stateName = commandText.substr(commandText.indexOf(" ") + 1);
		var saveStateManager = universe.saveStateManager;
		try
		{
			saveStateManager.saveStateLoadByName(stateName);
			universe.console.writeLine("Loaded state with name '" + stateName + "'.");
			world = universe.world;
			world.placeCurrent().draw(universe, world);
		}
		catch (ex)
		{
			universe.console.writeLine(ex.message);
		}
	}

	stateSave(universe, world, place, command)
	{
		var commandText = command.text;
		var stateName = commandText.substr(commandText.indexOf(" ") + 1);
		var stateToSave = new SaveState(stateName, universe.world);
		var saveStateManager = universe.saveStateManager;
		try
		{
			saveStateManager.saveStateSave(stateToSave);
			universe.console.writeLine("Saved state with name '" + stateName + "'.");
		}
		catch (ex)
		{
			universe.console.writeLine(ex.message);
		}
	}

	statesList(universe, world, place, command)
	{
		var saveStateNames = universe.saveStateManager.saveStateNamesGet();
		var message =
			"Saved States:\n\n"
			+ saveStateNames.join("\n")
			+ "\n\n"
			+ saveStateNames.length + " states currently saved.";
		universe.console.writeLine(message);
	}

	talkToSomething(universe, world, place, command)
	{
		var message = null;

		var commandText = command.text;

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

	unrecognized(universe, world, place, command)
	{
		universe.console.writeLine
		(
			"Unrecognized command: '" + command.text + "'."
		);
	}

	useSomething(universe, world, place, command)
	{
		var message = null;

		var commandText = command.text;

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

	wait(universe, world, place, command)
	{
		universe.console.writeLine("You wait a moment.");
	}

}
