"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class World {
            constructor(name, regions, items, agentPlayer, commands, scripts, turnsSoFar, placeCurrentName) {
                this.name = name;
                this.regions = regions;
                this.items = items;
                this.agentPlayer = agentPlayer;
                this.commands = commands;
                this.scripts = scripts;
                this.turnsSoFar = turnsSoFar || 0;
                this.placeCurrentName = placeCurrentName;
                this.places = new Array();
                this.regions.forEach(x => this.places.push(...x.places));
                this.isOver = false;
            }
            commandsAll() {
                var commandsAll = [];
                commandsAll.push(...this.commands);
                var player = this.agentPlayer;
                var playerCommands = player.commands();
                playerCommands.forEach(x => commandsAll.push(...playerCommands));
                var place = this.placeCurrent();
                var placeCommands = place.commands();
                commandsAll.push(...placeCommands);
                return commandsAll;
            }
            end() {
                this.isOver = true;
            }
            itemByName(name) {
                return this.items.find(x => x.names.indexOf(name) >= 0);
            }
            placeByName(name) {
                return this.places.find(x => x.name == name);
            }
            placeCurrent() {
                return this.placeByName(this.placeCurrentName);
            }
            placeCurrentSet(value) {
                return this.placeCurrentSetByName(value.name);
            }
            placeCurrentSetByName(placeName) {
                this.placeCurrentName = placeName;
                return this;
            }
            regionByPlace(place) {
                return this.regions.find(x => x.placeByName(place.name) != null);
            }
            scriptAdd(script) {
                this.scripts.push(script);
            }
            scriptByName(name) {
                var scriptFound = this.scripts.find(x => x.name == name);
                if (scriptFound == null) {
                    throw new Error("No script found with name '" + name + "'.");
                }
                return scriptFound;
            }
            updateForUniverseAndCommandText(universe, commandText) {
                if (commandText != null) {
                    this.updateForUniverseAndCommandText_CommandExecute(universe, commandText);
                }
                this.updateForUniverseAndCommandText_Update(universe);
            }
            updateForUniverseAndCommandText_CommandExecute(universe, commandText) {
                var commandsAll = this.commandsAll();
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
                        var placeCurrent = this.placeCurrent();
                        this.commandToExecute.execute(universe, this, placeCurrent, this.commandToExecute);
                        this.turnsSoFar++;
                    }
                }
            }
            updateForUniverseAndCommandText_Update(universe) {
                var world = universe.world; // Can't use "this" anymore: the command might have changed it.
                var placeCurrent = world.placeCurrent();
                world.agentPlayer.updateForTurn(universe, world, placeCurrent);
                placeCurrent.updateForTurn(universe, world);
                var messageForPlaceCurrent = placeCurrent.draw(universe, world);
                universe.messageEnqueue(messageForPlaceCurrent);
                universe.console.clear();
                var messageQueue = universe.messageQueue;
                while (messageQueue.hasMessages()) {
                    var message = messageQueue.dequeue();
                    universe.console.writeLinePlusBlankLine(message);
                }
            }
            // Clonable.
            clone() {
                return new World(this.name, this.regions.map(x => x.clone()), this.items.map(x => x.clone()), this.agentPlayer.clone(), this.commands.map(x => x.clone()), this.scripts.map(x => x.clone()), this.turnsSoFar, this.placeCurrentName);
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
