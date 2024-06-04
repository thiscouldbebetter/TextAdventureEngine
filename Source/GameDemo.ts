
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class GameDemo
{
	static worldBuild(): World
	{
		var player = new Agent
		(
			[ "self" ],
			null, // descriptionAsPartOfPlace
			"This is you.",
			null, // scriptUpdateForTurnName
			null, // stateGroup
			[
				Item.fromNamesAndDescription
				(
					[ "locket" ],
					"This small copper locket contains a picture of your sweetie."
				)
			],
			null // commands
		);

		var scriptsCustom = new Scripts();

		var p = (name: string, description: string, objects: any[]) =>
			Place.fromNameDescriptionAndObjects(name, description, objects);

		var portal =
			(a: string[], b: string, c: string) =>
				Portal.fromNamesDescriptionAndPlaceDestinationName(a, b, c);

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
				Emplacement.fromNamesAndDescriptions
				(
					[ "pool" ],
					"The center of the room is occupied by a shallow pool of water.",
					"This is a shallow, dirty, foul-smelling pool of water."
				),
				portal( [ "east" ], portalDescription, placeEasternRoomName),
				portal( [ "north" ], portalDescription, placeNorthernRoomName),
				portal( [ "south" ], portalDescription, placeSouthernRoomName),
				portal( [ "west" ], portalDescription, placeWesternRoomName),
				new Agent
				(
					[ "captor" ],
					null, // descriptionAsPartOfPlace
					"Your captor lingers by the trap door, waiting for you to retrieve his property.",
					Script.fromName(scriptsCustom.AgentCaptorUpdate.name),
					null, // stateGroup
					null, // items
					[
						Command.fromTextsAndScriptExecuteName
						(
							[ "talk to captor" ],
							scriptsCustom.AgentCaptorTalkTo.name
						),
						Command.fromTextsAndScriptExecuteName
						(
							[ "give coin to captor" ],
							scriptsCustom.ItemCoinGiveToCaptor.name
						)
					]
				)
			]
		);

		var placeEasternRoom = p
		(
			placeEasternRoomName,
			"This room is east of the center.  A doorway to the west leads back to the Center Room.",
			[
				portal( [ "west" ], portalDescription, placeCenterRoomName),
				Emplacement.fromNamesDescriptionsAndScriptUseName
				(
					[ "chest", "box" ],
					"There is a chest here.",
					"This is a sturdy, and very heavy, oaken chest with a lock.",
					scriptsCustom.EmplacementChestUse.name
				)
			]
		);

		var placeNorthernRoom = p
		(
			"Northern Room",
			"This room is north of the center.  A doorway to the south leads back to the Center Room.",
			[
				portal( [ "south" ] , portalDescription, placeCenterRoomName),
				Agent.fromNameAndDescription
				(
					"troll",
					"The scabrous troll leers malevolently at you."
				)
			]
		);

		var placeSouthernRoom = p
		(
			"Southern Room",
			"This room is south of the center.  A doorway to the north leads back to the Center Room.",
			[
				portal
				(
					[ "north" ],
					portalDescription,
					placeCenterRoomName
				),
				Item.fromNamesDescriptionAndScriptUseName
				(
					[ "key" ],
					"This is a large brass key.",
					Script.fromName(scriptsCustom.ItemKeyUse.name)
				)
			]
		);

		var placeWesternRoom = p
		(
			"Western Room",
			"This room is west of the center.  A doorway to the east leads back to the Center Room.",
			[
				portal( [ "east" ], portalDescription, placeCenterRoomName),
				Item.fromNamesDescriptionAndScriptUseName
				(
					[ "whetstone", "stone", "rock" ],
					"This is a flat stone for sharpening tools and weapons.",
					Script.fromName(scriptsCustom.ItemWhetstoneUse.name)
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

		var regionMain = Region.fromNameAndPlaces
		(
			"RegionMain",
			places
		);

		var regions = [ regionMain ];

		var commands = Command.Instances()._All;

		var scriptsAll = new Array<Script>;

		var commandsAsScripts = commands.map((x: Command) => x._scriptExecute);
		scriptsAll.push(...commandsAsScripts);

		scriptsAll.push(...scriptsCustom._All);

		var returnValue = new World
		(
			"Demo World",
			regions,
			[], // items
			player,
			commands,
			scriptsAll,
			null, // turnsSoFar,
			null
		);

		return returnValue;
	}

}

class Scripts
{
	AgentCaptorTalkTo: Script;
	AgentCaptorUpdate: Script;
	EmplacementChestUse: Script;
	EmplacementTrollBodyUse: Script;
	ItemCoinGiveToCaptor: Script;
	ItemKeyUse: Script;
	ItemSwordUse: Script;
	ItemTrollHeadTalkTo: Script;
	ItemWhetstoneUse: Script;
	PlaceCenterRoomUpdate: Script;
	Todo: Script;

	_All: Script[];

	constructor()
	{
		var s = (a: string, b: any) => new Script(a, b);

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
		this.Todo = s("Todo", this.todo);

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
			this.PlaceCenterRoomUpdate,
			this.Todo
		];
	}

	agentCaptorTalkTo(u: Universe, w: World, p: Place, agent: any): void
	{
		var message;

		var player = w.agentPlayer;
		var playerItems = player.items;
		var playerHasCoin = playerItems.some(x => x.name() == "coin");
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

	agentCaptorUpdate(u: Universe, w: World, p: Place, agent: any): void
	{
		// todo
	}

	emplacementChestUse(u: Universe, w: World, place: Place, emplacement: any): void
	{
		var message: string;
		var isEmpty = emplacement.stateGroup.valueGetByName(StateNames.isEmpty());
		var isUnlocked = emplacement.stateGroup.valueGetByName(StateNames.isUnlocked());
		if (isUnlocked != true)
		{
			message = "The chest is locked.";
		}
		else if (isEmpty)
		{
			message = "The chest is empty.";
		}
		else
		{
			message = "You open the chest and find a sword.";
			var itemSword = Item.fromNamesDescriptionAndScriptUseName
			(
				[ "sword" ],
				"This is a steel sword, too dull to cut anything.",
				Script.fromName("ItemSwordUse")
			);
			place.itemAdd(itemSword);
			emplacement.stateGroup.stateWithNameSetToValue(StateNames.isEmpty(), true);
		}

		u.messageEnqueue(message);
	}

	emplacementTrollBodyUse
	(
		u: Universe, w: World, place: Place,
		emplacementTrollBody: any, target: any
	): void
	{
		var message: string;

		if (target != null)
		{
			message = "You can't use the troll's body on anything.";
		}
		else
		{
			message = "You find a gold coin in the troll's coin purse.";

			var itemCoin = Item.fromNamesAndDescription
			(
				[ "coin" ], "This is a gold coin."
			);
			place.itemAdd(itemCoin);

			emplacementTrollBody._scriptUseName = null;
		}

		u.messageEnqueue(message);
	}

	itemCoinGiveToCaptor(universe: Universe, world: World, place: Place): void
	{
		var message;

		var player = world.agentPlayer;
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
			place.agentRemove(agentCaptor, world);

			var itemRope = Item.fromNamesAndDescription
			(
				[ "rope", "line", "cord" ],
				"This is a coil of weathered hempen rope."
			);
			place.itemAdd(itemRope);
		}

		universe.messageEnqueue(message);
	}

	itemKeyUse(u: Universe, w: World, p: Place, i: any, target: any)
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

	itemSwordUse(u: Universe, w: World, place: Place, item: any, target: any): void
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
			place.agentRemove(target, w);

			var emplacementTrollBody = Emplacement.fromNamesDescriptionsAndScriptUseName
			(
				[ "troll body", "body", "corpse", "troll body", "troll corpse", "dead troll" ],
				"A headless troll corpse is here.",
				"This is the headless corpse of the troll, naked except for a small coin purse.",
				"EmplacementTrollBodyUse"
			);
			place.emplacementAdd(emplacementTrollBody);

			var itemTrollHead = new Item
			(
				[ "troll head" ] ,
				null, // quantity
				null, // descriptionAsPartOfPlace
				"This is the head of the troll you killed.",
				null, // scriptNameGet
				null, // scriptNameUse
				null, // stateGroup
				null, // items
				[
					Command.fromTextsAndScriptExecuteName
					(
						[
							"talk to troll",
							"talk to the troll",
							"talk to troll head",
							"talk to the troll head"
						],
						"ItemTrollHeadTalkTo"
					)
				]
			);
			place.itemAdd(itemTrollHead);
		}
	}

	itemTrollHeadTalkTo(u: Universe, w: World, place: Place, item: any, target: any): void
	{
		var message = "The troll's head nods in agreement with what you're saying.";
		u.messageEnqueue(message);
	}

	itemWhetstoneUse(u: Universe, w: World, p: Place, i: any, target: any): void
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

	placeCenterRoomUpdate(u: Universe, w: World, p: Place): any
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

	todo(u: Universe, w: World, p: Place, i: any, target: any): void
	{
		u.messageEnqueue("todo");
	}

}

class StateNames
{
	static isEmpty(): string
	{
		return "isEmpty";
	}

	static isSharpened(): string
	{
		return "isSharpened";
	}

	static isUnlocked(): string
	{
		return "isUnlocked";
	}
}

}
