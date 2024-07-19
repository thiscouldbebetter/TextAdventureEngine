"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class StateGroup {
            constructor(states) {
                this.states = states || new Array();
            }
            static create() {
                return new StateGroup(null);
            }
            stateWithNameSetToFalse(stateToSetName) {
                return this.stateWithNameSetToValue(stateToSetName, false);
            }
            stateWithNameSetToTrue(stateToSetName) {
                return this.stateWithNameSetToValue(stateToSetName, true);
            }
            stateWithNameSetToValue(stateToSetName, value) {
                var stateFound = this.states.find(x => x.name == stateToSetName);
                if (stateFound == null) {
                    stateFound = new TextAdventureEngine.State(stateToSetName, value);
                    this.states.push(stateFound);
                }
                else {
                    stateFound.value = value;
                }
                return this;
            }
            stateWithNameGetValue(stateToGetName) {
                var stateFound = this.states.find(x => x.name == stateToGetName);
                var returnValue = (stateFound == null ? null : stateFound.value);
                return returnValue;
            }
            stateWithNameIsTrue(stateToGetName) {
                return (this.stateWithNameGetValue(stateToGetName) == true);
            }
            // Clonable.
            clone() {
                return new StateGroup(this.states.map(x => x.clone()));
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, StateGroup.prototype);
                instanceAsObject.states.forEach((x) => TextAdventureEngine.State.prototypesSet(x));
            }
            hidden() {
                return this.stateWithNameIsTrue(StateGroup.StateName_Hidden);
            }
            hiddenSet(value) {
                return this.stateWithNameSetToValue(StateGroup.StateName_Hidden, value);
            }
            hide() {
                return this.hiddenSet(true);
            }
            show() {
                return this.visibleSet(true);
            }
            visible() {
                return (this.hidden() == false);
            }
            visibleSet(value) {
                return this.hiddenSet(value == false);
            }
        }
        // Visibility.
        StateGroup.StateName_Hidden = "Hidden";
        TextAdventureEngine.StateGroup = StateGroup;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
