
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
			Game.commandDropSomethingExecute
		);

		this.GetSomething = new Command
		(
			"get ",
			Game.commandGetSomethingExecute
		);

		this.GoSomewhere = new Command
		(
			"go ",
			Game.commandGoSomewhereExecute
		);

		this.Help = new Command
		(
			"?",
			Game.commandHelpExecute
		);

		this.InventoryView = new Command
		(
			"inventory",
			Game.commandInventoryViewExecute
		);

		this.LookAround = new Command
		(
			"look",
			Game.commandLookAroundExecute
		);

		this.LookAtSomething = new Command
		(
			"look ",
			Game.commandLookAtSomethingExecute
		);

		this.Quit = new Command
		(
			"quit",
			Game.commandQuitExecute
		);

		this.TalkToSomething = new Command
		(
			"talk to ",
			Game.commandTalkToSomethingExecute
		);

		this.UseSomething = new Command
		(
			"use ",
			Game.commandUseSomethingExecute
		);

		this.Wait = new Command
		(
			"wait",
			Game.commandWaitExecute
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
}
