"use strict";
class State {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
    // Clonable.
    clone() {
        return new State(this.name, this.value);
    }
    // Serialization.
    static prototypesSet(instanceAsObject) {
        Object.setPrototypeOf(instanceAsObject, State.prototype);
    }
}
