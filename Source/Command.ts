
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Command
{
	textSource: TextSource;

	_scriptExecute: Script;

	constructor
	(
		textSource: TextSource,
		scriptExecute: Script
	)
	{
		this.textSource = textSource;
		this._scriptExecute = scriptExecute;
	}

	static fromTextAndScriptExecuteName(text: string, scriptExecuteName: string): Command
	{
		return new Command
		(
			TextSourceStrings.fromString(text),
			Script.fromName(scriptExecuteName)
		);
	}

	static fromTextSourceAndScriptExecute
	(
		textSource: TextSource,
		scriptExecute: Script
	): Command
	{
		return new Command(textSource, scriptExecute);
	}

	static fromTextSourceAndScriptExecuteName
	(
		textSource: TextSource, scriptExecuteName: string
	): Command
	{
		return new Command(textSource, Script.fromName(scriptExecuteName) );
	}

	static fromTextsAndScriptExecute
	(
		texts: string[],
		scriptExecute: Script
	): Command
	{
		return Command.fromTextSourceAndScriptExecute
		(
			TextSourceStrings.fromStrings(texts), scriptExecute
		);
	}

	static fromTextsAndScriptExecuteName
	(
		texts: string[], scriptExecuteName: string
	): Command
	{
		return new Command(TextSourceStrings.fromStrings(texts), Script.fromName(scriptExecuteName) );
	}

	static fromTextAndCommands(commandTextToMatch: string, commands: Command[]): Command
	{
		var commandsMatching = commands.filter
		(
			command => command.textSource.textMatchesAtStart(commandTextToMatch)
		);

		var commandMatching: Command;
		if (commandsMatching.length == 0)
		{
			commandMatching = commands.find(x => x.text() == "unrecognized");
			commandMatching =
				commandMatching.clone().textSourceSet
				(
					TextSourceStrings.fromString(commandTextToMatch)
				);
		}
		else
		{
			var commandMatchingExactly = commands.find
			(
				command => command.textSource.textMatchesExactly(commandTextToMatch)
			);

			if (commandMatchingExactly == null)
			{
				var commandTextMatchingLongestSoFar = "";

				for (var c = 0; c < commandsMatching.length; c++)
				{
					var commandMatching = commandsMatching[c];
					var commandTextMatches = commandMatching.textSource.textMatchesAtStart
					(
						commandTextToMatch
					);
					var commandTextMatching =
						commandTextMatches
						? commandMatching.textSource.textDefault()
						: "";
					if (commandTextMatching.length > commandTextMatchingLongestSoFar.length)
					{
						commandTextMatchingLongestSoFar =
							commandTextMatching;
						commandMatching = commandsMatching[c];
					}
				}

			}
			else
			{
				commandMatching = commandMatchingExactly;
			}
			commandMatching = commandMatching.clone();
			commandMatching.textSourceSet
			(
				TextSourceStrings.fromString(commandTextToMatch)
			);
		}

		return commandMatching;
	}

	static _instances: Command_Instances;
	static Instances(): Command_Instances
	{
		if (Command._instances == null)
		{
			Command._instances = new Command_Instances();
		}
		return Command._instances;
	}

	static cleanCommandText(commandText: string): string
	{
		var termsToIgnore =
		[
			"in",
			"into",
			"to",
			"through",
			"toward"
		];

		for (var i = 0; i < termsToIgnore.length; i++)
		{
			var term = termsToIgnore[i];
			commandText = commandText.split(term + " ").join("");
		}

		return commandText;
	}

	execute(universe: Universe, world: World, place: Place, command: Command): void
	{
		var message = "Command entered: " + this.text();
		universe.messageEnqueue(message);
		var scriptExecute = this.scriptExecute();
		scriptExecute.run(universe, world, place, this, null);
	}

	scriptExecute(): Script
	{
		return this._scriptExecute;
	}

	text(): string
	{
		return this.textSource.textDefault();
	}

	textSourceSet(value: TextSource): Command
	{
		this.textSource = value;
		return this;
	}

	textsInclude(textToCheck: string): boolean
	{
		return this.textSource.textMatchesExactly(textToCheck);
	}

	// Clonable.

	clone(): Command
	{
		return new Command
		(
			this.textSource.clone(),
			this._scriptExecute.clone()
		);
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, Command.prototype);
	}
}

export class Command_Instances
{
	AttackSomething: Command;
	BuySomething: Command;
	Cheat: Command;
	DropSomething: Command;
	GetSomething: Command;
	GiveSomething: Command;
	GoDirectionEast: Command;
	GoDirectionNorth: Command;
	GoDirectionSouth: Command;
	GoDirectionWest: Command;
	GoSomewhere: Command;
	Help: Command;
	Instructions: Command;
	InventoryView: Command;
	LockOrUnlockSomething: Command;
	LookAround: Command;
	LookAtSomething: Command;
	LookSomewhere: Command;
	MoveSomething: Command;
	OpenSomething: Command;
	Quit: Command;
	Restart: Command;
	SaySomething: Command;
	SearchSomething: Command;
	SellSomething: Command;
	StateDelete: Command;
	StateSave: Command;
	StateLoad: Command;
	StatesList: Command;
	TalkToSomething: Command;
	Unrecognized: Command;
	UseSomething: Command;
	Wait: Command;

	_All: Command[];

	constructor()
	{
		this.AttackSomething = Command.fromTextsAndScriptExecute
		(
			[
				"attack ", "fight ", "kill ", "destroy ", "punch ",
				"kick ", "strike ", "bash ", "smash ", "break "
			],
			new Script("AttackSomething", this.attackSomething)
		);

		this.BuySomething = Command.fromTextsAndScriptExecute
		(
			[ "buy " ],
			new Script("BuySomething", this.buySomething)
		);

		this.Cheat = Command.fromTextsAndScriptExecute
		(
			[ "cheat" ],
			new Script("Cheat", this.cheat)
		);

		this.DropSomething = Command.fromTextsAndScriptExecute
		(
			[ "drop ", "discard", "dump " ],
			new Script("DropSomething", this.dropSomething)
		);

		this.GetSomething = Command.fromTextsAndScriptExecute
		(
			[ "get ", "take ", "grab ", "pick up " ],
			new Script("GetSomething", this.getSomething)
		);

		this.GiveSomething = Command.fromTextsAndScriptExecute
		(
			[ "give " ],
			new Script("GiveSomething", this.giveSomething)
		);

		this.GoDirectionEast = Command.fromTextsAndScriptExecute
		(
			[ "e", "east", "go e", ],
			new Script("GoEast", this.goDirectionEast.bind(this) )
		);

		this.GoDirectionNorth = Command.fromTextsAndScriptExecute
		(
			[ "n", "north", "go n" ],
			new Script("GoNorth", this.goDirectionNorth.bind(this) )
		);

		this.GoDirectionSouth = Command.fromTextsAndScriptExecute
		(
			[ "s", "south", "go s" ],
			new Script("GoSouth", this.goDirectionSouth.bind(this) )
		);

		this.GoDirectionWest = Command.fromTextsAndScriptExecute
		(
			[ "w", "west", "go w" ],
			new Script("GoWest", this.goDirectionWest.bind(this) )
		);

		this.GoSomewhere = Command.fromTextsAndScriptExecute
		(
			[ "go ", "walk ", "run ", "go to", "go through" ],
			new Script("GoSomewhere", this.goSomewhere)
		);

		this.Help = Command.fromTextsAndScriptExecute
		(
			[ "?", "help" ],
			new Script("Help", this.help)
		);

		this.Instructions = Command.fromTextsAndScriptExecute
		(
			[ "instructions" ],
			new Script("Instructions", this.instructions)
		);

		this.InventoryView = Command.fromTextsAndScriptExecute
		(
			[ "inventory", "look at possessions" ],
			new Script("InventoryView", this.inventoryView)
		);

		this.LockOrUnlockSomething = Command.fromTextsAndScriptExecute
		(
			[ "lock ", "unlock " ],
			new Script("LockOrUnlockSomething", this.lockOrUnlockSomething)
		);

		this.LookAround = Command.fromTextSourceAndScriptExecute
		(
			TextSourcePhraseCombination.fromPhraseArrays
			([
				[ "look", "examine" ],
				[ null, "at" ],
				[ "around", "place", "room", "surroundings" ]
			]),
			new Script("LookAround", this.lookAround)
		);

		this.LookAtSomething = Command.fromTextsAndScriptExecute
		(
			[ "look at ", "examine ", "watch ", "view " ],
			new Script("LookAtSomething", this.lookAtSomething)
		);

		this.LookSomewhere = Command.fromTextsAndScriptExecute
		(
			[ "look " ],
			new Script("LookSomewhere", this.lookAtSomething) // hack
		);

		this.MoveSomething = Command.fromTextsAndScriptExecute
		(
			[ "push ", "pull ", "press ", "slide ", "lift ", "raise ", "lower ", "turn ", "twist " ],
			new Script("MoveSomething", this.moveSomething)
		);

		this.OpenSomething = Command.fromTextsAndScriptExecute
		(
			[ "open " ],
			new Script("OpenSomething", this.openSomething)
		);

		this.Quit = Command.fromTextsAndScriptExecute
		(
			[ "quit" ],
			new Script("Quit", this.quit)
		);

		this.Restart = Command.fromTextsAndScriptExecute
		(
			[ "restart" ],
			new Script("Restart", this.restart)
		);

		this.SaySomething = Command.fromTextsAndScriptExecute
		(
			[ "say ", "shout ", "yell ", "whisper " ],
			new Script("SaySomething", this.saySomething)
		);

		this.SearchSomething = Command.fromTextsAndScriptExecute
		(
			[ "search " ],
			new Script("search ", this.searchSomething)
		);

		this.SellSomething = Command.fromTextsAndScriptExecute
		(
			[ "sell " ],
			new Script("SellSomething", this.sellSomething)
		);

		this.StateDelete = Command.fromTextsAndScriptExecute
		(
			[ "delete " ],
			new Script("StateDelete", this.stateDelete)
		);

		this.StateLoad = Command.fromTextsAndScriptExecute
		(
			[ "load ", "restore " ],
			new Script("StateLoad", this.stateLoad)
		);

		this.StateSave = Command.fromTextsAndScriptExecute
		(
			[ "save " ],
			new Script("StateSave", this.stateSave)
		);

		this.StatesList = Command.fromTextsAndScriptExecute
		(
			[ "list saves" ],
			new Script("StatesList", this.statesList)
		);

		this.TalkToSomething = Command.fromTextsAndScriptExecute
		(
			[ "talk to ", "talk with " ],
			new Script("TalkToSomething", this.talkToSomething)
		);

		this.Unrecognized = Command.fromTextsAndScriptExecute
		(
			[ "unrecognized" ],
			new Script("Unrecognized", this.unrecognized)
		);

		this.UseSomething = Command.fromTextsAndScriptExecute
		(
			[ "use ", "activate " ],
			new Script("UseSomething", this.useSomething)
		);

		this.Wait = Command.fromTextsAndScriptExecute
		(
			[ "wait" ],
			new Script("Wait", this.wait)
		);

		this._All =
		[
			this.AttackSomething,
			this.BuySomething,
			this.Cheat,
			this.DropSomething,
			this.GetSomething,
			this.GiveSomething,
			this.GoDirectionEast,
			this.GoDirectionNorth,
			this.GoDirectionSouth,
			this.GoDirectionWest,
			this.GoSomewhere,
			this.Help,
			this.InventoryView,
			this.LockOrUnlockSomething,
			this.LookAround,
			this.LookAtSomething,
			this.LookSomewhere,
			this.MoveSomething,
			this.OpenSomething,
			this.Quit,
			this.Restart,
			this.SaySomething,
			this.SearchSomething,
			this.SellSomething,
			this.StateDelete,
			this.StateSave,
			this.StateLoad,
			this.StatesList,
			this.TalkToSomething,
			this.Unrecognized,
			this.UseSomething,
			this.Wait
		];
	}

	attackSomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		universe.messageEnqueue("You can attack something by using a weapon on it.");
	}

	buySomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		universe.messageEnqueue("todo");
	}

	cheat(universe: Universe, world: World, place: Place, command: Command): void
	{
		universe.messageEnqueue("You are cheating!");

		var commandText = command.text();
		var commandTextParts = commandText.split(" ");
		var cheatOperationName = commandTextParts[1] || "[none]";

		var message: string = null;

		if (cheatOperationName == "get")
		{
			var quantityOrNot =
				parseInt(commandTextParts[2]);
			var quantityIsSpecified = (isNaN(quantityOrNot) == false);

			var quantity: number;
			var itemToGetName: string;
			if (quantityIsSpecified)
			{
				quantity = quantityOrNot;
				itemToGetName = commandTextParts.slice(3).join(" ");
			}
			else
			{
				itemToGetName = commandTextParts.slice(3).join(" ");
			}

			var itemToGet = world.itemByName(itemToGetName);
			if (itemToGet == null)
			{
				message = "Unknown item: " + itemToGetName + ".";
			}
			else
			{
				message = "Player receives item(s): "
				if (quantityIsSpecified)
				{
					itemToGet.quantity = quantity;
					message += quantity + " "; 
				}
				message += itemToGetName;
				message += ".";
				world.agentPlayer.itemAdd(itemToGet);
			}
		}
		else if (cheatOperationName == "goto")
		{
			var placeDestinationNameOrIndex = commandTextParts.slice(2).join(" ");
			var placeDestinationIndex = parseInt(placeDestinationNameOrIndex);
			var placeDestination =
				isNaN(placeDestinationIndex)
				? world.placeByName(placeDestinationNameOrIndex)
				: world.places[placeDestinationIndex];

			if (placeDestination == null)
			{
				message = "No such place: " + placeDestinationNameOrIndex + ".";
			}
			else
			{
				placeDestinationIndex =
					world.places.indexOf(placeDestination);

				message =
					"Jumping to place: "
					+ placeDestination.name
					+ " (" + placeDestinationNameOrIndex + ").";
				world.placeCurrentSet(placeDestination);
			}
		}
		else if (cheatOperationName == "help")
		{
			message = Command_Instances.cheat_HelpMessage();
		}
		else if (cheatOperationName == "list")
		{
			var objectsToListTypeName = commandTextParts[2] || "[none]";
			if (objectsToListTypeName == "places")
			{
				message = "";
				var places = world.places;
				for (var p = 0; p < places.length; p++)
				{
					var place = places[p];
					message += p + ". " + place.name + "\n";
				}
			}
			else if (objectsToListTypeName == "items")
			{
				message = "";
				var items = world.items;
				for (var i = 0; i < items.length; i++)
				{
					var item = items[i];
					message += i + ". " + item.name() + "\n";
				}
			}
			else
			{
				message =
					"Unrecognized list type: " + objectsToListTypeName + ".\n\n"
					+ Command_Instances.cheat_HelpMessage();
			}
		}
		else if (cheatOperationName == "random")
		{
			var randomValueToSet = parseFloat(commandTextParts[2] || "0");
			universe.randomNumberGenerator.enqueue(randomValueToSet);
		}
		else
		{
			message =
				"Unrecognized cheat operation: " + cheatOperationName + ".\n\n"
				+ Command_Instances.cheat_HelpMessage();
		}

		universe.messageEnqueue(message);
	}

	static cheat_HelpMessage(): string
	{
		var helpMessage =
		[
			"Cheat Commands",
			"==============",
			"get <itemName> - Gives the player the specified item.",
			"goto <placeIndexOrName> - Jumps to the place indicated.",
			"help - Displays this list of cheat commands.",
			"list [places | items] - Displays a list of places or items."
		].join("\n");

		return helpMessage;
	}

	dropSomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		var commandText = command.text();
		var targetName = commandText.substr(commandText.indexOf(" ") + 1);
		var message = null;

		var player = world.agentPlayer;
		var itemToDrop = player.itemByName(targetName);
		if (itemToDrop == null)
		{
			message = "You don't have any " + targetName + ".";
		}
		else
		{
			message = "You drop the " + itemToDrop.name() + ".";
			player.itemDropQuantityIntoPlace(itemToDrop, 1, place);
		}

		universe.messageEnqueue(message);
	}

	getSomething
	(
		universe: Universe, world: World, place: Place, command: Command
	): void
	{
		var commandText = command.text();
		var targetName = commandText.substr(commandText.indexOf(" ") + 1);
		var message: string = null;

		place = world.placeCurrent();

		var emplacementToGet = place.emplacementByName(targetName);
		if (emplacementToGet != null)
		{
			message = "The " + emplacementToGet.name() + " cannot be picked up.";
		}
		else 
		{
			var agentToGet = place.agentByName(targetName);
			if (agentToGet != null)
			{
				message = "The " + agentToGet.name() + " cannot be picked up.";
			}
			else
			{
				var player = world.agentPlayer;

				var itemToGet = place.itemByName(targetName);
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
					var scriptGet = itemToGet.scriptGet();

					if (scriptGet != null)
					{
						scriptGet.run(universe, world, place, command, null);
					}
					else
					{
						message = "You take the " + itemToGet.name() + ".";
						world.agentPlayer.itemGetFromPlace(itemToGet, place);
					}
				}
			}
		}

		universe.messageEnqueue(message);
	}

	giveSomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		var message: string;

		var commandText = command.text();
		var commandTextMinusVerb = commandText.substring("give ".length);

		var textTo = " to ";
		var indexOfTo = commandTextMinusVerb.indexOf(textTo);
		if (indexOfTo < 0)
		{
			message = "You must specify a recipient to give it to."; 
		}
		else
		{
			var itemToGiveName = commandTextMinusVerb.substr(0, indexOfTo);
			var itemToGive = world.agentPlayer.itemByName(itemToGiveName);
			if (itemToGive == null)
			{
				message = "You don't have any " + itemToGive + "."; 
			}
			else
			{
				var recipientName =
					commandTextMinusVerb.substr(indexOfTo + textTo.length);
				var recipient = place.agentByName(recipientName);
				if (recipient == null)
				{
					message = "You don't see any " + recipientName + " here."; 
				}
				else
				{
					message = "todo";
				}
			}
		}

		universe.messageEnqueue(message);
	}

	goDirectionEast(universe: Universe, world: World, place: Place, command: Command): void
	{
		Command.Instances().goThroughPortalWithName(universe, world, "east");
	}

	goDirectionNorth(universe: Universe, world: World, place: Place, command: Command): void
	{
		Command.Instances().goThroughPortalWithName(universe, world, "north");
	}

	goDirectionSouth(universe: Universe, world: World, place: Place, command: Command): void
	{
		Command.Instances().goThroughPortalWithName(universe, world, "south");
	}

	goDirectionWest(universe: Universe, world: World, place: Place, command: Command): void
	{
		Command.Instances().goThroughPortalWithName(universe, world, "west");
	}

	goSomewhere
	(
		universe: Universe, world: World, place: Place, command: Command
	): void
	{
		var commandText = Command.cleanCommandText(command.text());
		var portalNameFromCommand =
			commandText.substr(commandText.indexOf(" ") + 1);
		var commands = Command.Instances();
		commands.goThroughPortalWithName(universe, world, portalNameFromCommand);
	}

	goThroughPortalWithName
	(
		universe: Universe,
		world: World,
		portalName: string
	): void
	{
		var place = world.placeCurrent();
		var portalsMatching = place.portalsByName(portalName);
		var portalsMatchingPassable = portalsMatching.filter(x => x.passable() );
		var portalMatching = portalsMatchingPassable[0];
		if (portalMatching == null)
		{
			universe.messageEnqueue("You can't go there.");
		}
		else if (portalsMatching.length > 1)
		{
			universe.messageEnqueue
			(
				"There's more than one " + portalName + " here.  Be more specific."
			);
		}
		else
		{
			portalMatching.use(universe, world, place);
		}
	}

	help(universe: Universe, world: World, place: Place, command: Command): void
	{
		var helpTextAsLines =
		[
			"To play, type a command and press the Enter key.",
			"For general instructions on how to play, enter 'instructions'.",
			"",
			"Recognized commands include:",
			"",
			"? - This text is displayed.",
			"cheat <operation> <argument> - Allows the player to cheat.",
			"delete <name> - Deletes the specified saved game.",
			"look, look around - The player examines the surroundings.",
			"look <name>, look at <name> - The player examines a particular thing.",
			"go <name> - The player attempts to leave the area by the specified exit.",
			"get <name> - The player attempts to pick up the item named.",
			"instructions - Lists some general instructions for playing text games.",
			"inventory - Displays a list of the player's possessions.",
			"list saves - Lists saved game states.",
			"quit - Quit the game.",
			"load <name> - Loads the saved game with the specified name.",
			"restart - Restarts the game.", 
			"save <name> - Saves the game using the specified name.",
			"talk to <name> - The player attempts to talk to someone or something.",
			"use <name> - The player attempts to use something.",
			"use <name> on <name2> - The player attempts to use something on something.",
			"wait - The player does nothing, and simply waits for something to happen."
		];
		var helpText = helpTextAsLines.join("\n");
		universe.messageEnqueue(helpText);
	}

	instructions(universe: Universe, world: World, place: Place, command: Command): void
	{
		var instructionsAsLines =
		[
			"In a text adventure game, your character is always in a place.  ",
			"Type 'look' and press enter to look around the place you're in.",
			"",
			"In addition to your character, places may contain items, ",
			"which can be picked up.  For example, if there's a coin in the place,",
			"you could pick it up by entering the command 'get coin'.",
			"The coin will then be added to the list of items you hold, ",
			"which can be viewed by entering the command 'inventory'.",
			"You could examine the coin in more detail by entering the command 'look coin'.",
			"",
			"There may be other things, or even people, in a place, ",
			"that cannot be picked up.  You can still look at them, ",
			"and sometimes you can interact with them in other ways. ",
			"For example, if a button is present, you could enter 'push button'.",
			"Sometimes you can use items held by your character on other things, ",
			"by entering commands like 'put coin in slot'.",
			"",
			"All the places in the game are connected to other places.  ",
			"You can go from one place to another by entering commands like 'go east' ",
			"or 'go outside' or 'go door'.",
			"",
			"Finally, you can enter the commands 'save' and 'restore' ",
			"to save and load the current state of the game.",
			"",
			"There are other commands available.  Type 'help' to see a list."
		];
		var instructions = instructionsAsLines.join("\n");
		universe.messageEnqueue(instructions);
	}


	inventoryView(universe: Universe, world: World, place: Place, command: Command): void
	{
		var player = world.agentPlayer;
		var items = player.items;
		var linesToWrite =
		[
			"Items Carried:"
		];
		items.forEach(x => linesToWrite.push(x.nameAndQuantity() ) );
		var message = linesToWrite.join("\n");
		universe.messageEnqueue(message);
	}

	lockOrUnlockSomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		universe.messageEnqueue
		(
			"You can lock or unlock things with keyholes by using the right key on them."
		);
	}

	lookAround(universe: Universe, world: World, place: Place, command: Command): void
	{
		place = world.placeCurrent();

		var placeDescriptionIncludingObjects =
			place.descriptionIncludingObjects();

		universe.messageEnqueue(placeDescriptionIncludingObjects);
	}

	lookAtSomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		var commandText = command.text();
		var textAt = " at ";
		var indexOfAt = commandText.indexOf(textAt);
		var targetName: string;
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

		var player = world.agentPlayer;
		var playerItems = player.items;

		place = world.placeCurrent();

		var targetsPossibleArrays =
		[
			playerItems,
			place.emplacements,
			place.portals,
			place.items,
			place.agents
		];

		for (var ta = 0; ta < targetsPossibleArrays.length; ta++)
		{
			var targetsPossible: any[] = targetsPossibleArrays[ta];

			for (var i = 0; i < targetsPossible.length; i++)
			{
				var targetsFound =
					targetsPossible.filter(x => x.namesInclude(targetName) );

				if (targetsFound.length > 1)
				{
					targetDescription =
						"There's more than one " + targetName + " here.  Be more specific."
				}
				else if (targetsFound.length > 0)
				{
					var targetFound = targetsFound[0];
					targetDescription = targetFound.descriptionWhenExamined;
					if (targetDescription == null)
					{
						targetDescription = "You don't see anything notable."
					}
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

		universe.messageEnqueue(targetDescription);
	}

	moveSomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		var commandText = command.text();
		var verbUsed = commandText.split(" ")[0];
		universe.messageEnqueue("You cannot " + verbUsed + " that.");
	}

	openSomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		universe.messageEnqueue
		(
			"You can open containers by using them, or things like doors by just going there."
		);
	}

	quit(universe: Universe, world: World, place: Place, command: Command): void
	{
		universe.messageEnqueue("Quitting.  The game is now over.");

		world.isOver = true;
	}

	restart(universe: Universe, world: World, place: Place, command: Command): void
	{
		universe.messageEnqueue("Restarting.");

		universe.world = universe.worldCreate();
	}

	saySomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		var commandText = command.text();
		var thingToSay = commandText.substr(commandText.indexOf(" ") + 1);

		universe.messageEnqueue
		(
			"You say, '" + thingToSay + "'.  There is no response." 
		);
	}

	searchSomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		universe.messageEnqueue
		(
			"You can search objects by using them, or sometimes by just looking at them."
		);
	}

	sellSomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		universe.messageEnqueue("todo");
	}

	stateDelete(universe: Universe, world: World, place: Place, command: Command): void
	{
		var commandText = command.text();
		var stateName = commandText.substr(commandText.indexOf(" ") + 1);
		var saveStateManager = universe.saveStateManager;
		try
		{
			saveStateManager.saveStateDeleteByName(stateName);
			universe.messageEnqueue("Deleted state with name '" + stateName + "'.");
		}
		catch (ex)
		{
			universe.messageEnqueue("Error during delete: " + ex.message);
		}
	}

	stateLoad(universe: Universe, world: World, place: Place, command: Command): void
	{
		var commandText = command.text();
		var stateName = commandText.substr(commandText.indexOf(" ") + 1);
		var saveStateManager = universe.saveStateManager;
		try
		{
			saveStateManager.saveStateLoadByName(stateName);

			// The world.scripts field cannot be easily or efficiently serialized,
			// so it will instead be copied from the old instance of World.
			universe.world.scripts = world.scripts;

			universe.messageEnqueue("Loaded state with name '" + stateName + "'.");
		}
		catch (ex)
		{
			universe.messageEnqueue("Error during load: " + ex.message);
		}
	}

	stateSave(universe: Universe, world: World, place: Place, command: Command): void
	{
		var commandText = command.text();
		var stateName = commandText.substr(commandText.indexOf(" ") + 1);
		var stateToSave = new SaveState(stateName, universe.world);
		var saveStateManager = universe.saveStateManager;
		try
		{
			saveStateManager.saveStateSave(stateToSave);
			universe.messageEnqueue("Saved state with name '" + stateName + "'.");
		}
		catch (ex)
		{
			universe.messageEnqueue("Error during save: " + ex.message);
		}
	}

	statesList(universe: Universe, world: World, place: Place, command: Command): void
	{
		var saveStateNames = universe.saveStateManager.saveStateNamesGet();
		var message =
			"Saved States:\n\n"
			+ saveStateNames.join("\n")
			+ "\n\n"
			+ saveStateNames.length + " states currently saved.";
		universe.messageEnqueue(message);
	}

	talkToSomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		var message = null;

		var commandText = command.text();

		var targetName = commandText.substr("talk to ".length);

		place = world.placeCurrent();

		var emplacementToTalkTo = place.emplacementByName(targetName);
		if (emplacementToTalkTo != null)
		{
			message = "The " + emplacementToTalkTo.name() + " says nothing.";
		}
		else 
		{
			var itemToTalkTo = place.itemByName(targetName);
			if (itemToTalkTo != null)
			{
				message = "The " + itemToTalkTo.name() + " says nothing.";
			}
			else
			{
				var agentToTalkTo = place.agentByName(targetName);
				if (agentToTalkTo == null)
				{
					message = "You don't see any " + targetName + " here.";
				}
				else
				{
					message = "The " + agentToTalkTo.name() + " says nothing.";
				}
			}
		}

		universe.messageEnqueue(message);
	}

	unrecognized(universe: Universe, world: World, place: Place, command: Command): void
	{
		universe.messageEnqueue
		(
			"Unrecognized command: '" + command.text() + "'."
		);
	}

	useSomething(universe: Universe, world: World, place: Place, command: Command): void
	{
		var message = null;

		var commandText = command.text();

		var objectName: string;
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

		var emplacementToUse =
			place.emplacementByName(objectName);

		if (emplacementToUse != null)
		{
			objectToUse = emplacementToUse;
		}
		else 
		{
			var agentToUse = place.agentByName(objectName);
			if (agentToUse != null)
			{
				message = "The " + agentToUse.name() + " cannot be used.";
			}
			else
			{
				var player = world.agentPlayer;
				var itemCarriedToUse =
					player.itemByName(objectName);

				if (itemCarriedToUse != null)
				{
					objectToUse = itemCarriedToUse;
				}
				else
				{
					var itemInRoomToUse =
						place.itemByName(objectName);

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

		if (objectToUse == null)
		{
			universe.messageEnqueue(message);
		}
		else if (objectToUse.canBeUsed() == false)
		{
			message = "The " + objectToUse.name() + " cannot be used.";
			universe.messageEnqueue(message);
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
					var player = world.agentPlayer;
					target = player.itemByName(targetToUseObjectOnName);
					if (target == null)
					{
						target = place.objectByName(targetToUseObjectOnName);
						if (target == null)
						{
							universe.messageEnqueue
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
					universe.messageEnqueue("That cannot be used on itself!");
				}
				else
				{
					objectToUse.use(universe, world, place, target);
				}
			}
		}
	}

	wait(universe: Universe, world: World, place: Place, command: Command): void
	{
		universe.messageEnqueue("You wait a moment.");
	}
}

}
