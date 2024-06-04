"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Item {
            constructor(names, quantity, descriptionAsPartOfPlace, descriptionWhenExamined, scriptGet, scriptUse, stateGroup, items, commands) {
                this.names = names;
                this.quantity = quantity || 1;
                this.descriptionAsPartOfPlace = descriptionAsPartOfPlace;
                this.descriptionWhenExamined = descriptionWhenExamined;
                this._scriptGet = scriptGet;
                this._scriptUse = scriptUse;
                this.stateGroup = stateGroup || new TextAdventureEngine.StateGroup([]);
                this.items = items || [];
                this.commands = commands || [];
            }
            static create() {
                return new Item(null, null, null, null, null, null, null, null, null);
            }
            static fromNames(names) {
                return Item.create().namesSet(names);
            }
            static fromNamesAndDescription(names, description) {
                return Item.fromNames(names).descriptionWhenExaminedSet(description);
            }
            static fromNamesDescriptionAndScriptUseName(names, descriptionWhenExamined, scriptUse) {
                return Item.fromNamesAndDescription(names, descriptionWhenExamined).scriptUseSet(scriptUse);
            }
            static fromNamesDescriptionAndScriptGetName(names, description, scriptGetName) {
                return Item.fromNamesAndDescription(names, description).scriptGetSet(TextAdventureEngine.Script.fromName(scriptGetName));
            }
            canBeUsed() {
                return (this._scriptUse != null);
            }
            commandAdd(command) {
                this.commands.push(command);
                return this;
            }
            commandAddFromTextSourceAndScriptName(commandTextSource, scriptName) {
                var command = TextAdventureEngine.Command.fromTextSourceAndScriptExecuteName(commandTextSource, scriptName);
                return this.commandAdd(command);
            }
            descriptionAsPartOfPlaceSet(value) {
                this.descriptionAsPartOfPlace = value;
                return this;
            }
            descriptionWhenExaminedSet(value) {
                this.descriptionWhenExamined = value;
                return this;
            }
            itemAdd(itemToAdd) {
                this.items.push(itemToAdd);
                return this;
            }
            itemsAdd(itemsToAdd) {
                itemsToAdd.forEach(x => this.items.push(x));
                return this;
            }
            itemsClear() {
                this.items.length = 0;
                return this;
            }
            name() {
                return this.names[0];
            }
            nameAndQuantity() {
                var quantityOrNotAsString = (this.quantity > 1 ? "" + this.quantity + " " : "");
                var name = this.name();
                var returnValue = quantityOrNotAsString + name;
                return returnValue;
            }
            namesInclude(nameToMatch) {
                return this.names.indexOf(nameToMatch) >= 0;
            }
            namesSet(value) {
                this.names = value;
                return this;
            }
            quantitySet(value) {
                this.quantity = value;
                return this;
            }
            scriptGet() {
                return this._scriptGet;
            }
            scriptGetSet(value) {
                this._scriptGet = value;
                return this;
            }
            scriptUse() {
                return this._scriptUse;
            }
            scriptUseSet(value) {
                this._scriptUse = value;
                return this;
            }
            updateForTurn(universe, world, place) {
                // todo
            }
            use(universe, world, place, target) {
                var scriptUse = this.scriptUse();
                if (scriptUse != null) {
                    scriptUse.run(universe, world, place, this, target);
                }
            }
            visible() {
                return true;
            }
            // Clonable.
            clone() {
                return new Item(this.names.map(x => x), this.quantity, this.descriptionAsPartOfPlace, this.descriptionWhenExamined, this._scriptGet == null ? null : this._scriptGet.clone(), this._scriptUse == null ? null : this._scriptUse.clone(), this.stateGroup.clone(), this.items.map(x => x.clone()), this.commands.map(x => x.clone()));
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, Item.prototype);
                TextAdventureEngine.StateGroup.prototypesSet(instanceAsObject.stateGroup);
                instanceAsObject.commands.forEach((x) => TextAdventureEngine.Command.prototypesSet(x));
            }
            // States - Activation.
            activate() {
                this.stateGroup.stateWithNameSetToTrue("Activated");
                return this;
            }
            activated() {
                return this.stateGroup.stateWithNameIsTrue("Activated");
            }
            deactivate() {
                this.stateGroup.stateWithNameSetToFalse("Activated");
                return this;
            }
        }
        TextAdventureEngine.Item = Item;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
