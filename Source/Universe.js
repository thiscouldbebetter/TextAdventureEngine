"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Universe {
            constructor(console, timerManager, worldCreate) {
                this.console = console;
                this.timerManager = timerManager;
                this.worldCreate = worldCreate;
            }
            static fromWorldCreate(worldCreate) {
                return new Universe(TextAdventureEngine.ConsoleTextarea.default(), TextAdventureEngine.TimerManager.default(), worldCreate);
            }
            initialize() {
                this.world = this.worldCreate();
                this.messageQueue = new TextAdventureEngine.MessageQueue();
                this.randomNumberGenerator = new TextAdventureEngine.RandomNumberGenerator();
                this.storageManager = new TextAdventureEngine.StorageManagerMemory();
                this.saveStateManager =
                    new TextAdventureEngine.SaveStateManager(this, this.storageManager);
                this.commandEnteredAsText = null;
                this.inputTracker = new TextAdventureEngine.InputTracker();
                var universe = this;
                this.timerManager.tickHandlerSet(() => universe.updateForTimerTick());
                this.timerManager.start();
                this.inputTracker.start();
            }
            messageEnqueue(message) {
                this.messageQueue.enqueue(message);
                return this;
            }
            updateForTimerTick() {
                var console = this.console;
                if (console.reading()) {
                    console.updateForTimerTick(this);
                }
                else {
                    var commandText = this.console.textRead();
                    this.world.updateForUniverseAndCommandText(this, commandText);
                    console.write("Enter a command (? for help): ");
                    console.readLine();
                }
            }
        }
        TextAdventureEngine.Universe = Universe;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
