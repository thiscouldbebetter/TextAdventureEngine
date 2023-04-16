"use strict";
class SaveState {
    constructor(name, world) {
        this.name = name;
        this.world = world.clone();
    }
    // Serialization.
    static fromString(saveStateAsString) {
        var saveState = JSON.parse(saveStateAsString);
        SaveState.prototypesSet(saveState);
        return saveState;
    }
    static prototypesSet(instanceAsObject) {
        Object.setPrototypeOf(instanceAsObject, SaveState.prototype);
        World.prototypesSet(instanceAsObject.world);
    }
    toString() {
        return JSON.stringify(this);
    }
}
