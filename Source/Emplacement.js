"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Emplacement {
            constructor(names, description, scriptUseName, stateGroup, commands) {
                this.names = names;
                this.description = description;
                this._scriptUseName = scriptUseName;
                this.stateGroup = stateGroup || new TextAdventureEngine.StateGroup([]);
                this.commands = commands || [];
            }
            static fromName(name) {
                return Emplacement.fromNames([name]);
            }
            static fromNames(names) {
                var description = "This is just a " + names[0] + ".";
                return Emplacement.fromNamesAndDescription(names, description);
            }
            static fromNamesAndDescription(names, description) {
                return new Emplacement(names, description, null, null, null);
            }
            static fromNamesDescriptionAndScriptUseName(names, description, scriptUseName) {
                return new Emplacement(names, description, scriptUseName, null, null);
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
                return new Emplacement(this.names.map(x => x), this.description, this._scriptUseName, this.stateGroup.clone(), this.commands.map(x => x.clone()));
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
