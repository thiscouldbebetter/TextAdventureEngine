"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Agent {
            constructor(names, description, scriptUpdateForTurnName, stateGroup, items, commands) {
                this.names = names;
                this.description = description;
                this.scriptUpdateForTurnName = scriptUpdateForTurnName;
                this.stateGroup = stateGroup || TextAdventureEngine.StateGroup.create();
                this.items = items || [];
                this._commands = commands || [];
            }
            static fromNameAndDescription(name, description) {
                return new Agent([name], description, null, null, null, null);
            }
            static fromNames(names) {
                return new Agent(names, null, null, null, null, null);
            }
            commands() {
                var commandsAll = new Array();
                this.items.forEach(x => commandsAll.push(...x.commands));
                return commandsAll;
            }
            commandAdd(command) {
                this._commands.push(command);
                return this;
            }
            commandAddFromTextsAndScriptName(commandTexts, scriptName) {
                var command = new TextAdventureEngine.Command(commandTexts, scriptName);
                return this.commandAdd(command);
            }
            descriptionSet(value) {
                this.description = value;
                return this;
            }
            name() {
                return this.names[0];
            }
            namesInclude(nameToMatch) {
                return this.names.indexOf(nameToMatch) >= 0;
            }
            updateForTurn(universe, world, place) {
                if (this.scriptUpdateForTurnName != null) {
                    var scriptUpdate = world.scriptByName(this.scriptUpdateForTurnName);
                    scriptUpdate.run(universe, world, place, this);
                }
                this.items.forEach(x => x.updateForTurn());
            }
            // Clonable.
            clone() {
                return new Agent(this.names.map(x => x), this.description, this.scriptUpdateForTurnName, this.stateGroup.clone(), this.items.map(x => x.clone()), this._commands.map(x => x.clone()));
            }
            // Items.
            itemAdd(item) {
                this.items.push(item);
            }
            itemByName(name) {
                return this.items.find(x => x.names.indexOf(name) >= 0);
            }
            itemDropQuantityIntoPlace(itemToDrop, quantityToDrop, place) {
                var itemToDrop = this.itemRemoveQuantity(itemToDrop, quantityToDrop);
                if (itemToDrop != null) {
                    place.itemAdd(itemToDrop);
                }
            }
            itemGetFromPlace(itemToGet, place) {
                place.itemRemove(itemToGet);
                this.itemAdd(itemToGet);
            }
            itemsAdd(itemsToAdd) {
                this.items.push(...itemsToAdd);
                return this;
            }
            itemRemove(item) {
                this.items.splice(this.items.indexOf(item), 1);
            }
            itemRemoveQuantity(itemToRemoveFrom, quantityToRemove) {
                var itemRemoved;
                var itemQuantityBefore = itemToRemoveFrom.quantity;
                if (itemQuantityBefore < quantityToRemove) {
                    itemRemoved = null;
                }
                else {
                    itemRemoved = itemToRemoveFrom.clone().quantitySet(quantityToRemove);
                    itemToRemoveFrom.quantity -= quantityToRemove;
                    if (itemToRemoveFrom.quantity <= 0) {
                        this.itemRemove(itemToRemoveFrom);
                    }
                }
                return itemRemoved;
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, Agent.prototype);
                instanceAsObject.items.forEach((x) => TextAdventureEngine.Item.prototypesSet(x));
                instanceAsObject.commands.forEach((x) => TextAdventureEngine.Command.prototypesSet(x));
            }
            // States.
            visible() { return true; }
        }
        TextAdventureEngine.Agent = Agent;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
