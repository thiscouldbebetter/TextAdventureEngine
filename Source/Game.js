
class Game
{
	static worldBuild()
	{
		var player = new Player
		(
			"Demo Player",
			[
				new Item
				(
					"locket",
					"This small gold locket contains a picture of your sweetie."
				)
			]
		);

		var p = (name, description, objects) =>
			Place.fromNameDescriptionAndObjects(name, description, objects);

		var portalDescription = "This is a normal door with a round knob.";

		var placeCenterRoomName = "Center Room";
		var placeEasternRoomName = "Eastern Room";
		var placeNorthernRoomName = "Northern Room";
		var placeSouthernRoomName = "Southern Room";
		var placeWesternRoomName = "Western Room";

		var placeCenterRoom = p
		(
			placeCenterRoomName,
			"This room is in the center.  There are doors to the north, south, east, and west.",
			[
				new Portal("east", portalDescription, placeEasternRoomName),
				new Portal("north", portalDescription, placeNorthernRoomName),
				new Portal("south", portalDescription, placeSouthernRoomName),
				new Portal("west", portalDescription, placeWesternRoomName)
			]
		);

		var placeEasternRoom = p
		(
			placeEasternRoomName,
			"This room is east of the center.  A doorway to the west leads back to the Center Room.",
			[
				new Portal("west", portalDescription, placeCenterRoomName),
				new Emplacement
				(
					"chest",
					"This is a sturdy, and very heavy, oaken chest with a lock.",
					(u, w, place, emplacement) =>
					{
						var message;
						if (emplacement.isUnlocked)
						{
							u.console.writeLine("You open the chest and see a sword.");
							var itemSword = new Item
							(
								"sword",
								"This is a steel sword, too dull to cut anything.",
								(u, w, place, item, target) =>
								{
									if (target == null)
									{
										u.console.writeLine("You swing the sword around wildly.");
									}
									else if (target.name != "troll")
									{
										u.console.writeLine("That would only dull the sword.");
									}
									else if (item.isSharpened != true) // hack
									{
										u.console.writeLine("The dull sword bounces off the troll's skin.  He retaliates by killing you.");
										u.world = null;
									}
									else
									{
										u.console.writeLine("The sword slices the troll's head off, killing it.");
										place.agentRemove(target);
										var itemTrollCorpse = new Item
										(
											"troll corpse",
											"This is the headless corpse of the troll, naked except for a small coin purse.",
											(u, w, place, item, target) =>
											{
												if (target != null)
												{
													u.console.writeLine("You can't use the troll on anything.");
												}
												else
												{
													u.console.writeLine("You find a gold coin in the troll's coin purse.");
													var itemCoin = new Item("coin", "This is a gold coin.");
													place.itemAdd(itemCoin);
												}
											}
										);
										place.itemAdd(itemTrollCorpse);
									}
								}
							);
							place.itemAdd(itemSword);
						}
						else
						{
							u.console.writeLine("The chest is locked.");
						}
					}
				)
			]
		);

		var placeNorthernRoom = p
		(
			"Northern Room",
			"This room is north of the center.  A doorway to the south leads back to the Center Room.",
			[
				new Portal("south", portalDescription, placeCenterRoomName),
				new Agent("troll", "The scabrous troll leers malevolently at you.")
			]
		);

		var placeSouthernRoom = p
		(
			"Southern Room",
			"This room is south of the center.  A doorway to the north leads back to the Center Room.",
			[
				new Portal("north", portalDescription, placeCenterRoomName),
				new Item
				(
					"key",
					"This is a large brass key.",
					(u, w, p, i, target) =>
					{
						if (target == null)
						{
							u.console.writeLine("The key must be used on something.");
						}
						else if (target.name != "chest")
						{
							u.console.writeLine("That does not have a keyhole!");
						}
						else
						{
							u.console.writeLine("You put the key in the keyhole and turn to unlock the chest.");
							target.isUnlocked = true;
						}
					}
				)
			]
		);

		var placeWesternRoom = p
		(
			"Western Room",
			"This room is west of the center.  A doorway to the east leads back to the Center Room.",
			[
				new Portal("east", portalDescription, placeCenterRoomName),
				new Item
				(
					"whetstone",
					"This is a flat stone for sharpening tools and weapons.",
					(u, w, p, i, target) =>
					{
						if (target == null)
						{
							u.console.writeLine("The whetstone must be used on something.");
						}
						else if (target.name != "sword")
						{
							u.console.writeLine("That cannot be sharpened!");
						}
						else
						{
							u.console.writeLine("You stroke the edge of the sword with the whetstone, sharpening it.");
							target.isSharpened = true;
							target.description = "This is a sharp steel sword.";
						}
					}
				)
			]
		);

		var places =
		[
			placeCenterRoom,
			placeEasternRoom,
			placeNorthernRoom,
			placeSouthernRoom,
			placeWesternRoom
		];

		var commands = Command.Instances()._All;

		var returnValue = new World
		(
			"Demo World",
			places,
			player,
			commands
		);

		return returnValue;
	}

	static commandDropSomethingExecute(universe, world, place)
	{
		var commandText = this.text;
		var targetName = commandText.split(" ")[1];
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

	static commandGetSomethingExecute(universe, world, place)
	{
		var commandText = this.text;
		var targetName = commandText.split(" ")[1];
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

	static commandGoSomewhereExecute(universe, world, place)
	{
		place = world.placeCurrent();
		var portals = place.portals;
		var commandText = this.text;
		var portalNameFromCommand = commandText.split(" ")[1];
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

	static commandHelpExecute(universe, world, place)
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
			"quit - Quit the game.",
			"talk <name> - The player attempts to talk to someone or something.",
			"use <name> - The player attempts to use something.",
			"use <name> on <name2> - The player attempts to use something on something.",
			"wait - The player does nothing, and simply waits for something to happen."
		];
		var console = universe.console;
		console.writeLines(helpTextAsLines);
	}

	static commandInventoryViewExecute(universe, world, place)
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

	static commandLookAroundExecute(universe, world, place)
	{
		place = world.placeCurrent();
		universe.console.writeLine(place.description);
	}

	static commandLookAtSomethingExecute(universe, world, place)
	{
		var commandText = this.text;
		var targetName = commandText.split(" ")[1];
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

	static commandQuitExecute(universe, world, place)
	{
		universe.console.writeLine("Quitting.");

		universe.world = null;
	}

	static commandTalkToSomethingExecute(universe, world, place)
	{
		var commandText = this.text;
		var targetName = commandText.split(" ")[2];
		var message = null;

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

	static commandUseSomethingExecute(universe, world, place)
	{
		var commandText = this.text;
		var commandParts = commandText.split(" ");
		var objectName = commandParts[1];
		var message = null;
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
		else
		{
			if (objectToUse.canBeUsed() == false)
			{
				message = "The " + objectToUse.name + " cannot be used.";
				console.writeLine(message);
			}
			else
			{
				var target = null;

				var targetToUseObjectOnName = commandParts[3];
				if (targetToUseObjectOnName != null)
				{
					var textOn = commandParts[2];
					if (textOn != "on")
					{
						console.writeLine("Unrecognized command part: '" + textOn + "'.");
						objectToUse = null;
					}
					else
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

	}

	static commandWaitExecute(universe, world, place)
	{
		universe.console.writeLine("You wait a moment.");
	}

}
