
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
					Scripts.emplacementChestUse
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

}

class Scripts
{
	static emplacementChestUse(u, w, place, emplacement)
	{
		var message;
		if (emplacement.isUnlocked)
		{
			u.console.writeLine("You open the chest and see a sword.");
			var itemSword = new Item
			(
				"sword",
				"This is a steel sword, too dull to cut anything.",
				Scripts.itemSwordUse
			);
			place.itemAdd(itemSword);
		}
		else
		{
			u.console.writeLine("The chest is locked.");
		}
	}

	static itemSwordUse(u, w, place, item, target)
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
			var emplacementTrollCorpse = new Emplacement
			(
				"troll corpse",
				"This is the headless corpse of the troll, naked except for a small coin purse.",
				Scripts.itemTrollCorpseUse
			);
			place.emplacementAdd(emplacementTrollCorpse);
		}
	}

	static itemTrollCorpseUse(u, w, place, item, target) 
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

}
