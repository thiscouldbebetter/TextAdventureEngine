
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Universe
{
	console: ConsoleTextarea;
	inputTracker: InputTracker;
	messageQueue: MessageQueue;
	saveStateManager: SaveStateManager;
	storageManager: StorageManager2;
	timerManager: TimerManager;
	worldCreate: ()=>World;

	world: World;
	commandEnteredAsText: string;

	constructor
	(
		console: ConsoleTextarea,
		timerManager: TimerManager,
		worldCreate: ()=>World
	)
	{
		this.console = console;
		this.timerManager = timerManager;
		this.worldCreate = worldCreate;
	}

	static fromWorldCreate(worldCreate: ()=>World): Universe
	{
		return new Universe
		(
			ConsoleTextarea.default(),
			TimerManager.default(),
			worldCreate
		);
	}

	initialize(): void
	{
		this.world = this.worldCreate();

		this.messageQueue = new MessageQueue();

		this.storageManager = new StorageManagerMemory();

		this.saveStateManager =
			new SaveStateManager(this, this.storageManager);

		this.commandEnteredAsText = null;

		this.inputTracker = new InputTracker();

		var universe = this;
		this.timerManager.tickHandlerSet
		(
			() => universe.updateForTimerTick()
		);
		this.timerManager.start();

		this.inputTracker.start();
	}

	messageEnqueue(message: string): void
	{
		this.messageQueue.enqueue(message);
	}

	updateForTimerTick(): void
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

}
