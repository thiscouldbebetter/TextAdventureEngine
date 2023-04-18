"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class World {
            constructor(name, places, player, commands, scripts, turnsSoFar, placeCurrentName) {
                this.name = name;
                this.places = places;
                this.player = player;
                this.commands = commands;
                this.scripts = scripts;
                this.turnsSoFar = turnsSoFar || 0;
                this.placeCurrentName = placeCurrentName || this.places[0].name;
                this.isOver = false;
            }
            placeByName(name) {
                return this.places.find(x => x.name == name);
            }
            placeCurrent() {
                return this.placeByName(this.placeCurrentName);
            }
            placeCurrentSet(value) {
                this.placeCurrentName = value.name;
            }
            scriptAdd(script) {
                this.scripts.push(script);
            }
            scriptByName(name) {
                return this.scripts.find(x => x.name == name);
            }
            updateForUniverseAndCommandText(universe, commandText) {
                if (commandText != null) {
                    var commandsAll = [];
                    commandsAll.push(...this.commands);
                    var player = this.player;
                    var playerItems = player.items;
                    playerItems.forEach(x => commandsAll.push(...x.commands));
                    var place = this.placeCurrent();
                    var placeCommands = place.commands();
                    commandsAll.push(...placeCommands);
                    this.commandToExecute =
                        TextAdventureEngine.Command.fromTextAndCommands(commandText, commandsAll);
                    if (this.commandToExecute != null) {
                        if (this.isOver) {
                            if (commandText.startsWith("load ") == false
                                && commandText != "restart") {
                                var message = "The game is over.  You can't do anything but load or restart.\n";
                                universe.messageEnqueue(message);
                                this.commandToExecute = null;
                            }
                        }
                        if (this.commandToExecute != null) {
                            this.commandToExecute.execute(universe, this, place, this.commandToExecute);
                            universe.messageEnqueue("");
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
                while (messageQueue.hasMessages()) {
                    var message = messageQueue.dequeue();
                    universe.console.writeLine(message);
                }
            }
            // Clonable.
            clone() {
                return new World(this.name, this.places.map(x => x.clone()), this.player.clone(), this.commands.map(x => x.clone()), this.scripts.map(x => x.clone()), this.turnsSoFar, this.placeCurrentName);
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, World.prototype);
                instanceAsObject.places.forEach((x) => TextAdventureEngine.Place.prototypesSet(x));
                TextAdventureEngine.Agent.prototypesSet(instanceAsObject.player);
                instanceAsObject.commands.forEach((x) => TextAdventureEngine.Command.prototypesSet(x));
                // Scripts cannot be easily of efficiently serialized,
                // so they'll just be copied from a non-serialized instance.
                instanceAsObject.scripts = new Array();
            }
        }
        TextAdventureEngine.World = World;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
