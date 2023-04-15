
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

	messageEnqueue(message)
	{
		this.console.writeLine(message);
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
}
