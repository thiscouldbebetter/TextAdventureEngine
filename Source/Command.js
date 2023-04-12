
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
