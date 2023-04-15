
class Game
{
	static worldBuild()
	{
		var player = new Agent
		(
			"self",
			"This is you.",
			null, // scriptUpdateForTurnName
			[
				Item.fromNameAndDescription
				(
					"locket",
					"This small copper locket contains a picture of your sweetie."
				)
			]
		);

		var scriptsCustom = new Scripts();

		var p = (name, description, objects) =>
			Place.fromNameDescriptionAndObjects(name, description, objects);

		var portalDescription = "This is a normal door with a round knob.";

		var placeCenterRoomName = "Center Room";
		var placeEasternRoomName = "Eastern Room";
		var placeNorthernRoomName = "Northern Room";
		var placeSouthernRoomName = "Southern Room";
		var placeWesternRoomName = "Western Room";

		var placeCenterRoom = Place.fromNameDescriptionScriptNameAndObjects
		(
			placeCenterRoomName,
			"This is the room you landed in when your captor threw you down here."
				+ "  There are doors to the north, south, east, and west.",
			scriptsCustom.PlaceCenterRoomUpdate.name,
			[
				new Emplacement("pool", "This is a shallow, dirty, foul-smelling pool of water."),
				new Portal("east", portalDescription, placeEasternRoomName),
				new Portal("north", portalDescription, placeNorthernRoomName),
				new Portal("south", portalDescription, placeSouthernRoomName),
				new Portal("west", portalDescription, placeWesternRoomName),
				new Agent
				(
					"captor",
					"Your captor lingers by the trap door, waiting for you to retrieve his property.",
					scriptsCustom.AgentCaptorUpdate.name,
					null, // items
					[
						new Command( [ "talk to captor" ], scriptsCustom.AgentCaptorTalkTo.name),
						new Command( [ "give coin to captor" ], scriptsCustom.ItemCoinGiveToCaptor.name)
					]
				)
			]
		);

		var placeEasternRoom = p
		(
			placeEasternRoomName,
			"This room is east of the center.  A doorway to the west leads back to the Center Room.",
			[
				new Portal("west", portalDescription, placeCenterRoomName),
				Emplacement.fromNameDescriptionAndScriptUse
				(
					"chest",
					"This is a sturdy, and very heavy, oaken chest with a lock.",
					scriptsCustom.EmplacementChestUse
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
				Item.fromNameDescriptionAndScriptUse
				(
					"key",
					"This is a large brass key.",
					scriptsCustom.ItemKeyUse
				)
			]
		);

		var placeWesternRoom = p
		(
			"Western Room",
			"This room is west of the center.  A doorway to the east leads back to the Center Room.",
			[
				new Portal("east", portalDescription, placeCenterRoomName),
				Item.fromNameDescriptionAndScriptUse
				(
					"whetstone",
					"This is a flat stone for sharpening tools and weapons.",
					scriptsCustom.ItemWhetstoneUse
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

		var scriptsAll = [];

		var commandsAsScripts = commands.map(x => x._scriptExecute);
		scriptsAll.push(...commandsAsScripts);

		scriptsAll.push(...scriptsCustom._All);

		var returnValue = new World
		(
			"Demo World",
			places,
			player,
			commands,
			scriptsAll
		);

		return returnValue;
	}

}

class Scripts
{
	constructor()
	{
		var s = (a, b) => new Script(a, b);

		this.AgentCaptorTalkTo = s("AgentCaptorTalkTo", this.agentCaptorTalkTo);
		this.AgentCaptorUpdate = s("AgentCaptorUpdate", this.agentCaptorUpdate);
		this.EmplacementChestUse = s("EmplacementChestUse", this.emplacementChestUse);
		this.EmplacementTrollBodyUse = s("EmplacementTrollBodyUse", this.emplacementTrollBodyUse);
		this.ItemCoinGiveToCaptor = s("ItemCoinGiveToCaptor", this.itemCoinGiveToCaptor);
		this.ItemKeyUse = s("ItemKeyUse", this.itemKeyUse);
		this.ItemSwordUse = s("ItemSwordUse", this.itemSwordUse);
		this.ItemTrollHeadTalkTo = s("ItemTrollHeadTalkTo", this.itemTrollHeadTalkTo);
		this.ItemWhetstoneUse = s("ItemWhetstoneUse", this.itemWhetstoneUse);
		this.PlaceCenterRoomUpdate = s("PlaceCenterRoomUpdate", this.placeCenterRoomUpdate);

		this._All =
		[
			this.AgentCaptorTalkTo,
			this.AgentCaptorUpdate,
			this.EmplacementChestUse,
			this.EmplacementTrollBodyUse,
			this.ItemCoinGiveToCaptor,
			this.ItemKeyUse,
			this.ItemSwordUse,
			this.ItemTrollHeadTalkTo,
			this.ItemWhetstoneUse,
			this.PlaceCenterRoomUpdate
		];
	}

	agentCaptorTalkTo(u, w, p, agent)
	{
		var message;

		var player = w.player;
		var playerItems = player.items;
		var playerHasCoin = playerItems.some(x => x.name == "coin");
		if (playerHasCoin == false)
		{
			message = "Your captor says, 'Get me my coin back from the troll, and I'll throw you down a rope.'";
		}
		else
		{
			message = "Your captor says, 'Give that coin to me, and I'll throw you down a rope.'";
		}

		u.messageEnqueue(message);
	}

	agentCaptorUpdate(u, w, p, agent)
	{
		// todo
	}

	emplacementChestUse(u, w, place, emplacement)
	{
		var message;
		var isEmpty = emplacement.stateGroup.valueGetByName(StateNames.isEmpty());
		var isUnlocked = emplacement.stateGroup.valueGetByName(StateNames.isUnlocked());
		if (isUnlocked != true)
		{
			u.messageEnqueue("The chest is locked.");
		}
		else if (isEmpty)
		{
			u.messageEnqueue("The chest is empty.");
		}
		else
		{
			u.messageEnqueue("You open the chest and find a sword.");
			var itemSword = new Item
			(
				"sword",
				"This is a steel sword, too dull to cut anything.",
				"ItemSwordUse"
			);
			place.itemAdd(itemSword);
			emplacement.stateGroup.stateWithNameSetToValue(StateNames.isEmpty(), true);
		}
	}

	emplacementTrollBodyUse(u, w, place, emplacementTrollBody, target)
	{
		var message;

		if (target != null)
		{
			message = "You can't use the troll's body on anything.";
		}
		else
		{
			var message = "You find a gold coin in the troll's coin purse.";

			var itemCoin = new Item("coin", "This is a gold coin.");
			place.itemAdd(itemCoin);

			emplacementTrollBody._scriptUseName = null;
		}

		u.messageEnqueue(message);
	}

	itemCoinGiveToCaptor(universe, world, place)
	{
		var message;

		var player = world.player;
		var itemCoin = player.itemByName("coin");
		if (itemCoin == null)
		{
			message = "You don't have any coin.";
		}
		else
		{
			player.itemRemove(itemCoin);

			message =
				"You throw the coin up to the captor.  He catches it, laughs, and says, "
				+ "'A deal's a deal.  Here's that rope I promised you.'  "
				+ "Without tying it to anything first, he throws down a coil of rope "
				+ "and walks away.  You hear his laughter fade in the distance."

			place = world.placeCurrent();

			var agentCaptor = place.agentByName("captor");
			agentCaptor.itemAdd(itemCoin);
			place.agentRemove(agentCaptor);

			var itemRope = new Item
			(
				"rope",
				"This is a coil of weathered hempen rope."
			);
			place.itemAdd(itemRope);
		}

		universe.messageEnqueue(message);
	}

	itemKeyUse(u, w, p, i, target)
	{
		if (target == null)
		{
			u.messageEnqueue("The key must be used on something.");
		}
		else if (target.name != "chest")
		{
			u.messageEnqueue("That does not have a keyhole!");
		}
		else if (target.stateGroup.valueGetByName(StateNames.isUnlocked() ) )
		{
			u.messageEnqueue
			(
				"You use the key to lock the chest."
			);
			target.stateGroup.stateWithNameSetToValue(StateNames.isUnlocked(), false);
		}
		else
		{
			u.messageEnqueue
			(
				"You put the key in the keyhole and turn to unlock the chest."
			);
			target.stateGroup.stateWithNameSetToValue(StateNames.isUnlocked(), true);
		}
	}

	itemSwordUse(u, w, place, item, target)
	{
		if (target == null)
		{
			u.messageEnqueue("You swing the sword around wildly.");
		}
		else if (target.name != "troll")
		{
			u.messageEnqueue("That would only dull the sword.");
		}
		else if (item.stateGroup.valueGetByName(StateNames.isSharpened()) != true) // hack
		{
			var messageLines =
			[
				"The dull sword bounces off the troll's thick, rubbery skin.",
				"He retaliates by disemboweling you with his claws.",
				"",
				"You are dead."
			]
			w.isOver = true;
			var message = messageLines.join("\n");
			u.messageEnqueue(message);
		}
		else
		{
			var message =
				"The sharp sword slices the troll's head off, killing it.";
			u.messageEnqueue(message);
			place.agentRemove(target);

			var emplacementTrollBody = new Emplacement
			(
				"troll body",
				"This is the headless corpse of the troll, naked except for a small coin purse.",
				"EmplacementTrollBodyUse"
			);
			place.emplacementAdd(emplacementTrollBody);

			var itemTrollHead = new Item
			(
				"troll head",
				"This is the head of the troll you killed.",
				null, // scriptNameUse
				null, // stateGroup
				[
					new Command
					(
						[ "talk to troll", "talk to the troll", "talk to troll head", "talk to the troll head" ],
						"ItemTrollHeadTalkTo"
					)
				]
			);
			place.itemAdd(itemTrollHead);
		}
	}

	itemTrollHeadTalkTo(u, w, place, item, target)
	{
		var message = "The troll's head nods in agreement with what you're saying.";
		u.messageEnqueue(message);
	}

	itemWhetstoneUse(u, w, p, i, target)
	{
		if (target == null)
		{
			u.messageEnqueue("The whetstone must be used on something.");
		}
		else if (target.name != "sword")
		{
			u.messageEnqueue("That cannot be sharpened!");
		}
		else
		{
			u.messageEnqueue("You stroke the edge of the sword with the whetstone, sharpening it.");
			target.stateGroup.stateWithNameSetToValue(StateNames.isSharpened(), true);
			target.description = "This is a sharp steel sword.";
		}
	}

	placeCenterRoomUpdate(u, w, p)
	{
		if (p.hasBeenVisited() == false)
		{
			var messageLines =
			[
				"You are thrown roughly through a hole, fall perhaps twelve feet, ",
				"and land painfully in a dirty, shallow pool in an uneven stone floor.  ",
				"As you stagger to your feet, dripping, and check yourself for injuries, ",
				"your captor glares down at you from the rim of the hole ",
				"and says, 'There's a troll somewhere down there.  ",
				"He has my money.  Kill him, get it, and give it to me.  ",
				"Maybe then I'll let you go.'",
				"\n"
			]
			var message = messageLines.join("");
			u.messageEnqueue(message);
		}
	}

}

class StateNames
{
	static isEmpty()
	{
		return "isEmpty";
	}

	static isSharpened()
	{
		return "isSharpened";
	}

	static isUnlocked()
	{
		return "isUnlocked";
	}
}
