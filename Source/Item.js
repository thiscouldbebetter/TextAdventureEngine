"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Item {
            constructor(names, description, scriptGetName, scriptUseName, stateGroup, commands) {
                this.names = names;
                this.description = description;
                this._scriptGetName = scriptGetName;
                this._scriptUseName = scriptUseName;
                this.stateGroup = stateGroup || new TextAdventureEngine.StateGroup([]);
                this.commands = commands || [];
            }
            static fromNamesAndDescription(names, description) {
                return new Item(names, description, null, null, null, null);
            }
            static fromNamesDescriptionAndScriptUseName(names, description, scriptUseName) {
                return new Item(names, description, null, scriptUseName, null, null);
            }
            static fromNamesDescriptionAndScriptGetName(names, description, scriptGetName) {
                return new Item(names, description, scriptGetName, null, null, null);
            }
            canBeUsed() {
                return (this._scriptUseName != null);
            }
            commandAdd(command) {
                this.commands.push(command);
                return this;
            }
            name() {
                return this.names[0];
            }
            namesInclude(nameToMatch) {
                return this.names.indexOf(nameToMatch) >= 0;
            }
            scriptGet(world) {
                return this._scriptGetName == null ? null : world.scriptByName(this._scriptGetName);
            }
            scriptUse(world) {
                return world.scriptByName(this._scriptUseName);
            }
            updateForTurn() {
                // todo
            }
            use(universe, world, place, target) {
                var scriptUse = this.scriptUse(world);
                if (scriptUse != null) {
                    scriptUse.run(universe, world, place, this, target);
                }
            }
            visible() {
                return true;
            }
            // Clonable.
            clone() {
                return new Item(this.names.map(x => x), this.description, this._scriptGetName, this._scriptUseName, this.stateGroup.clone(), this.commands.map(x => x.clone()));
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, Item.prototype);
                TextAdventureEngine.StateGroup.prototypesSet(instanceAsObject.stateGroup);
                instanceAsObject.commands.forEach((x) => TextAdventureEngine.Command.prototypesSet(x));
            }
        }
        TextAdventureEngine.Item = Item;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
