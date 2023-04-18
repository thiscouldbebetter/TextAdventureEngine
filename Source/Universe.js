"use strict";
class Universe {
    constructor(console, timerManager, worldCreate) {
        this.console = console;
        this.timerManager = timerManager;
        this.worldCreate = worldCreate;
    }
    static fromWorldCreate(worldCreate) {
        return new Universe(Console.default(), TimerManager.default(), worldCreate);
    }
    initialize() {
        this.world = this.worldCreate();
        this.messageQueue = new MessageQueue();
        this.storageManager = new StorageManagerMemory();
        this.saveStateManager =
            new SaveStateManager(this, this.storageManager);
        this.commandEnteredAsText = null;
        this.inputTracker = new InputTracker();
        var universe = this;
        this.timerManager.tickHandlerSet(() => universe.updateForTimerTick());
        this.timerManager.start();
        this.inputTracker.start();
    }
    messageEnqueue(message) {
        this.messageQueue.enqueue(message);
    }
    updateForTimerTick() {
        var console = this.console;
        if (console.isReading()) {
            console.updateForTimerTick(this);
        }
        else {
            var commandText = this.console.textReadSoFar;
            this.world.updateForUniverseAndCommandText(this, commandText);
            console.write("Enter a command (? for help): ");
            console.readLine();
        }
    }
}
