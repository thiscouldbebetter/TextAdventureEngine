
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class World
{
	name: string;
	regions: Region[];
	items: Item[];
	agentPlayer: Agent;
	commands: Command[];
	scripts: Script[];
	turnsSoFar: number;
	placeCurrentName: string;

	places: Place[];

	commandToExecute: Command;
	isOver: boolean;

	constructor
	(
		name: string,
		regions: Region[],
		items: Item[],
		agentPlayer: Agent,
		commands: Command[],
		scripts: Script[],
		turnsSoFar: number,
		placeCurrentName: string
	)
	{
		this.name = name;
		this.regions = regions;
		this.items = items;
		this.agentPlayer = agentPlayer;
		this.commands = commands;
		this.scripts = scripts;
		this.turnsSoFar = turnsSoFar || 0;
		this.placeCurrentName = placeCurrentName;

		this.places = new Array<Place>();
		this.regions.forEach(x => this.places.push(...x.places) );

		this.isOver = false;
	}

	commandsAll(): Command[] 
	{
		var commandsAll = [];
		commandsAll.push(...this.commands);

		var player = this.agentPlayer;
		var playerCommands = player.commands();
		playerCommands.forEach(x => commandsAll.push(...playerCommands) );

		var place = this.placeCurrent();
		var placeCommands = place.commands();
		commandsAll.push(...placeCommands);

		return commandsAll;
	}

	end(): void
	{
		this.isOver = true;
	}

	itemByName(name: string): Item
	{
		return this.items.find(x => x.names.indexOf(name) >= 0);
	}

	placeByName(name: string): Place
	{
		return this.places.find(x => x.name == name);
	}

	placeCurrent(): Place
	{
		return this.placeByName(this.placeCurrentName);
	}

	placeCurrentSet(value: Place): World
	{
		return this.placeCurrentSetByName(value.name);
	}

	placeCurrentSetByName(placeName: string): World
	{
		this.placeCurrentName = placeName;
		return this;
	}

	regionByPlace(place: Place): Region
	{
		return this.regions.find(x => x.placeByName(place.name) != null);
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
			this.updateForUniverseAndCommandText_CommandExecute
			(
				universe, commandText
			);
		}

		this.updateForUniverseAndCommandText_Update(universe);
	}

	updateForUniverseAndCommandText_CommandExecute
	(
		universe: Universe, commandText: string
	): void
	{
		var commandsAll = this.commandsAll();

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
				var placeCurrent = this.placeCurrent();

				this.commandToExecute.execute
				(
					universe, this, placeCurrent, this.commandToExecute
				);
				this.turnsSoFar++;
			}
		}
	}

	updateForUniverseAndCommandText_Update
	(
		universe: Universe
	): void
	{
		var world = universe.world; // Can't use "this" anymore: the command might have changed it.

		var placeCurrent = world.placeCurrent();

		world.agentPlayer.updateForTurn(universe, world, placeCurrent);

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
			this.regions.map(x => x.clone() ),
			this.items.map(x => x.clone() ),
			this.agentPlayer.clone(),
			this.commands.map(x => x.clone() ),
			this.scripts.map(x => x.clone() ),
			this.turnsSoFar,
			this.placeCurrentName
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
