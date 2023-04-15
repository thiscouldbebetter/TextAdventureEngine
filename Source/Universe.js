
class Universe
{
	constructor(worldCreate)
	{
		this.worldCreate = worldCreate;
	}

	initialize()
	{
		this.world = this.worldCreate();
		this.saveStateManager = new SaveStateManager(this);
		this.storageManager = new StorageManager();
		var d = document;
		var textareaConsole =
			d.getElementById("textareaConsole");
		this.console = new Console(textareaConsole);

		this.console.writeLine("Session begins.");

		this.commandEnteredAsText = null;

		this.inputTracker = new InputTracker();

		var universe = this;
		this.timerManager = new TimerManager
		(
			24, // ticksPerSecond
			() => universe.updateForTimerTick()
		);
		this.timerManager.start();

		this.inputTracker.start();
	}

	updateForTimerTick()
	{
		var console = this.console;
		if (console.isReading() )
		{
			console.updateForTimerTick(this);
		}
		else
		{
			var commandText = this.console.textReadSoFar;
			this.world.updateForUniverseAndCommandText(this, commandText);
			console.write("Enter a command (? for help): ");
			console.readLine();
		}
	}

	update_Old()
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
					() =>
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
