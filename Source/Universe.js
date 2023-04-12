
class Universe
{
	constructor(worldCreate)
	{
		this.worldCreate = worldCreate;
	}

	initialize()
	{
		this.world = this.worldCreate();
		this.uiEventHandler = new UiEventHandler(this);
		this.uiEventHandler.initialize();
		var d = document;
		var textareaConsole =
			d.getElementById("textareaConsole");
		this.console = new Console(textareaConsole);

		this.console.writeLine("Session begins.");

		this.commandEnteredAsText = null;
	}

	update()
	{
		var console = this.console;

		console.clear();
		console.writeLine();

		var universe = this;

		if (this.world == null)
		{
			console.writeLine("The game is over.");
			console.write("Enter 'restart' to start again: ");
			console.readLine
			(
				(commandText) =>
				{
					if (commandText == "restart")
					{
						universe.initialize();
					}

					universe.update();
				}
			);
		}
		else
		{
			this.world.update(this);

			console.writeLine();

			if (this.world == null)
			{
				console.write("Game over.  Press the Enter key to quit: ");
				console.readLine
				(
					(commandText) =>
					{
						universe.update();
					}
				)
			}
			else
			{
				console.write("Enter a command (? for help): ");

				console.readLine
				(
					(commandText) =>
					{
						universe.commandEnteredAsText = commandText;

						universe.update();
					}
				);
			}
		}
	}
}
