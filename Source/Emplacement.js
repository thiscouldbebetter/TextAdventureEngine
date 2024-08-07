"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Emplacement {
            constructor(names, descriptionAsPartOfPlace, descriptionWhenExamined, scriptUpdateForTurn, scriptUse, stateGroup, items, commands) {
                this.names = names;
                this.descriptionAsPartOfPlace = descriptionAsPartOfPlace;
                this.descriptionWhenExamined = descriptionWhenExamined;
                this._scriptUpdateForTurn = scriptUpdateForTurn;
                this._scriptUse = scriptUse;
                this.stateGroup = stateGroup || new TextAdventureEngine.StateGroup([]);
                this.items = items || [];
                this.commands = commands || [];
            }
            static fromName(name) {
                return Emplacement.fromNames([name]);
            }
            static fromNames(names) {
                return Emplacement.fromNamesAndDescriptions(names, null, // descriptionAsPartOfPlace
                null // descriptionWhenExamined
                );
            }
            static fromNamesAndDescriptions(names, descriptionAsPartOfPlace, descriptionWhenExamined) {
                return new Emplacement(names, descriptionAsPartOfPlace, descriptionWhenExamined, null, null, null, null, null);
            }
            static fromNamesDescriptionsAndScriptUseName(names, descriptionAsPartOfPlace, descriptionWhenExamined, scriptUseName) {
                return new Emplacement(names, descriptionAsPartOfPlace, descriptionWhenExamined, null, // scriptUpdateForTurn
                TextAdventureEngine.Script.fromName(scriptUseName), null, null, null);
            }
            canBeUsed() {
                return (this._scriptUse != null);
            }
            commandAdd(command) {
                this.commands.push(command);
                return this;
            }
            commandAddFromTextSourceAndScriptName(textSource, scriptName) {
                var command = TextAdventureEngine.Command.fromTextSourceAndScriptExecuteName(textSource, scriptName);
                return this.commandAdd(command);
            }
            commandAddFromTextsAndScriptName(commandTexts, scriptName) {
                var command = TextAdventureEngine.Command.fromTextsAndScriptExecuteName(commandTexts, scriptName);
                return this.commandAdd(command);
            }
            commandWithTextRemove(commandText) {
                var commandToRemove = this.commands.find(x => x.textsInclude(commandText));
                if (commandToRemove != null) {
                    this.commands.splice(this.commands.indexOf(commandToRemove), 1);
                }
                return this;
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
            itemByName(name) {
                return this.items.find(x => x.namesInclude(name));
            }
            name() {
                return this.names[0];
            }
            namesInclude(nameToMatch) {
                return this.names.indexOf(nameToMatch) >= 0;
            }
            scriptUpdateForTurnSet(value) {
                this._scriptUpdateForTurn = value;
                return this;
            }
            scriptUse() {
                return this._scriptUse;
            }
            scriptUseSet(value) {
                this._scriptUse = value;
                return this;
            }
            use(universe, world, place, target) {
                var scriptUse = this.scriptUse();
                if (scriptUse != null) {
                    scriptUse.run(universe, world, place, this, target);
                }
            }
            // Clone.
            clone() {
                return new Emplacement(this.names.map(x => x), this.descriptionAsPartOfPlace, this.descriptionWhenExamined, this._scriptUpdateForTurn == null ? null : this._scriptUpdateForTurn.clone(), this._scriptUse == null ? null : this._scriptUse.clone(), this.stateGroup.clone(), this.items.map(x => x.clone()), this.commands.map(x => x.clone()));
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
            hidden() {
                return this.stateGroup.hidden();
            }
            hiddenSet(value) {
                this.stateGroup.hiddenSet(value);
                return this;
            }
            visible() {
                return (this.hidden() == false);
            }
            visibleSet(value) {
                return this.hiddenSet(value == false);
            }
        }
        TextAdventureEngine.Emplacement = Emplacement;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
