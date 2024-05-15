
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class World
{
	name: string;
	places: Place[];
	player: Agent;
	commands: Command[];
	scripts: Script[];
	turnsSoFar: number;
	placeCurrentName: string;

	commandToExecute: Command;
	isOver: boolean;

	constructor
	(
		name: string,
		places: Place[],
		player: Agent,
		commands: Command[],
		scripts: Script[],
		turnsSoFar: number,
		placeCurrentName: string
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

	end()
	{
		this.isOver = true;
	}

	placeByName(name: string): Place
	{
		return this.places.find(x => x.name == name);
	}

	placeCurrent(): Place
	{
		return this.placeByName(this.placeCurrentName);
	}

	placeCurrentSet(value: Place): void
	{
		this.placeCurrentName = value.name;
	}

	scriptAdd(script: Script): void
	{
		this.scripts.push(script);
	}

	scriptByName(name: string): Script
	{
		var scriptFound = this.scripts.find(x => x.name == name);
		if (scriptFound == null)
		{
			throw new Error("No script found with name '" + name + "'.");
		}
		return scriptFound;
	}

	updateForUniverseAndCommandText(universe: Universe, commandText: string): void
	{
		if (commandText != null)
		{
			var commandsAll = [];
			commandsAll.push(...this.commands);

			var player = this.player;
			var playerItems = player.items;
			playerItems.forEach(x => commandsAll.push(...x.commands) );

			var place = this.placeCurrent();
			var placeCommands = place.commands();
			commandsAll.push(...placeCommands);

			this.commandToExecute =
				Command.fromTextAndCommands(commandText, commandsAll);

			if (this.commandToExecute != null)
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
						this.commandToExecute = null;
					}
				}

				if (this.commandToExecute != null)
				{
					this.commandToExecute.execute(universe, this, place, this.commandToExecute);
				}
			}
		}

		var world = universe.world; // Can't use "this" anymore: the command might have changed it.

		var placeCurrent = world.placeCurrent();

		world.player.updateForTurn(universe, this, placeCurrent);

		placeCurrent.updateForTurn(universe, world);

		var messageForPlaceCurrent = placeCurrent.draw(universe, world);
		universe.messageEnqueue(messageForPlaceCurrent);

		universe.console.clear();

		var messageQueue = universe.messageQueue;
		while (messageQueue.hasMessages())
		{
			var message = messageQueue.dequeue();
			universe.console.writeLinePlusBlankLine(message);
		}
	}

	// Clonable.

	clone(): World
	{
		return new World
		(
			this.name,
			this.places.map(x => x.clone()),
			this.player.clone(),
			this.commands.map(x => x.clone()),
			this.scripts.map(x => x.clone()),
			this.turnsSoFar,
			this.placeCurrentName,
		);
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, World.prototype);
		instanceAsObject.places.forEach( (x: any) => Place.prototypesSet(x) );
		Agent.prototypesSet(instanceAsObject.player);
		instanceAsObject.commands.forEach( (x: any) => Command.prototypesSet(x) );

		// Scripts cannot be easily of efficiently serialized,
		// so they'll just be copied from a non-serialized instance.
		instanceAsObject.scripts = new Array<Script>();
	}
}

}
