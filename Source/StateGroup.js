"use strict";
class StateGroup {
    constructor(states) {
        this.states = states || new Array();
    }
    stateWithNameSetToValue(stateToSetName, value) {
        var stateFound = this.states.find(x => x.name == stateToSetName);
        if (stateFound == null) {
            stateFound = new State(stateToSetName, value);
            this.states.push(stateFound);
        }
        else {
            stateFound.value = value;
        }
    }
    valueGetByName(stateToGetName) {
        var stateFound = this.states.find(x => x.name == stateToGetName);
        var returnValue = (stateFound == null ? null : stateFound.value);
        return returnValue;
    }
    // Clonable.
    clone() {
        return new StateGroup(this.states.map(x => x.clone()));
    }
    // Serialization.
    static prototypesSet(instanceAsObject) {
        Object.setPrototypeOf(instanceAsObject, StateGroup.prototype);
        instanceAsObject.states.forEach((x) => State.prototypesSet(x));
    }
}
