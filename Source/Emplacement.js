"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Emplacement {
            constructor(name, description, scriptUseName, stateGroup, commands) {
                this.name = name;
                this.description = description;
                this._scriptUseName = scriptUseName;
                this.stateGroup = stateGroup || new TextAdventureEngine.StateGroup([]);
                this.commands = commands || [];
            }
            static fromName(name) {
                var description = "This is just a " + name + ".";
                return new Emplacement(name, description, null, null, null);
            }
            static fromNameAndDescription(name, description) {
                return new Emplacement(name, description, null, null, null);
            }
            static fromNameDescriptionAndScriptUse(name, description, scriptUse) {
                return new Emplacement(name, description, scriptUse.name, null, null);
            }
            static fromNameDescriptionAndScriptUseName(name, description, scriptUseName) {
                return new Emplacement(name, description, scriptUseName, null, null);
            }
            canBeUsed() {
                return (this._scriptUseName != null);
            }
            commandAdd(command) {
                this.commands.push(command);
                return this;
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
                return new Emplacement(this.name, this.description, this._scriptUseName, this.stateGroup.clone(), this.commands.map(x => x.clone()));
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
            visible() {
                return this.stateWithNameIsTrue("Visible");
            }
            visibleSet(value) {
                return this.stateWithNameSetToTrue("Visible");
            }
        }
        TextAdventureEngine.Emplacement = Emplacement;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
