"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Emplacement {
            constructor(names, description, scriptUseName, stateGroup, items, commands) {
                this.names = names;
                this.description = description;
                this._scriptUseName = scriptUseName;
                this.stateGroup = stateGroup || new TextAdventureEngine.StateGroup([]);
                this.items = items || [];
                this.commands = commands || [];
            }
            static fromName(name) {
                return Emplacement.fromNames([name]);
            }
            static fromNames(names) {
                var description = "You don't see anything notable.";
                return Emplacement.fromNamesAndDescription(names, description);
            }
            static fromNamesAndDescription(names, description) {
                return new Emplacement(names, description, null, null, null, null);
            }
            static fromNamesDescriptionAndScriptUseName(names, description, scriptUseName) {
                return new Emplacement(names, description, scriptUseName, null, null, null);
            }
            canBeUsed() {
                return (this._scriptUseName != null);
            }
            commandAdd(command) {
                this.commands.push(command);
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
            itemAdd(itemToAdd) {
                this.items.push(itemToAdd);
                return this;
            }
            itemByName(name) {
                return this.items.find(x => x.namesInclude(name));
            }
            name() {
                return this.names[0];
            }
            namesInclude(nameToMatch) {
                return this.names.indexOf(nameToMatch) >= 0;
            }
            scriptUse(world) {
                return world.scriptByName(this._scriptUseName);
            }
            use(universe, world, place, target) {
                var scriptUse = this.scriptUse(world);
                if (scriptUse != null) {
                    scriptUse.run(universe, world, place, this, target);
                }
            }
            // Clone.
            clone() {
                return new Emplacement(this.names.map(x => x), this.description, this._scriptUseName, this.stateGroup.clone(), this.items.map(x => x.clone()), this.commands.map(x => x.clone()));
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, Emplacement.prototype);
                TextAdventureEngine.StateGroup.prototypesSet(instanceAsObject.stateGroup);
                instanceAsObject.commands.forEach((x) => TextAdventureEngine.Command.prototypesSet(x));
            }
            // States.
            stateWithNameGetValue(stateToGetName) {
                return this.stateGroup.stateWithNameGetValue(stateToGetName);
            }
            stateWithNameIsTrue(stateName) {
                return (this.stateWithNameGetValue(stateName) == true);
            }
            stateWithNameSetToTrue(stateToSetName) {
                return this.stateWithNameSetToValue(stateToSetName, true);
            }
            stateWithNameSetToValue(stateToSetName, valueToSet) {
                this.stateGroup.stateWithNameSetToValue(stateToSetName, valueToSet);
                return this;
            }
            // Activation.
            activate() {
                this.stateGroup.stateWithNameSetToTrue("Activated");
                return this;
            }
            activated() {
                var stateValue = this.stateGroup.stateWithNameGetValue("Activated");
                return stateValue || false;
            }
            deactivate() {
                this.stateGroup.stateWithNameSetToFalse("Activated");
                return this;
            }
            // Locking.
            lock() {
                return this.lockedSet(true);
            }
            locked() {
                return this.stateWithNameIsTrue("Locked");
            }
            lockedSet(value) {
                return this.stateWithNameSetToValue("Locked", value);
            }
            unlock() {
                return this.lockedSet(false);
            }
            // Visibility.
            hide() {
                return this.visibleSet(false);
            }
            show() {
                return this.visibleSet(true);
            }
            visible() {
                return this.stateWithNameIsTrue("Visible");
            }
            visibleSet(value) {
                return this.stateWithNameSetToValue("Visible", value);
            }
        }
        TextAdventureEngine.Emplacement = Emplacement;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
