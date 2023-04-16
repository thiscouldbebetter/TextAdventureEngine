"use strict";
class Emplacement {
    constructor(name, description, scriptUseName, stateGroup, commands) {
        this.name = name;
        this.description = description;
        this._scriptUseName = scriptUseName;
        this.stateGroup = stateGroup || new StateGroup([]);
        this.commands = commands || [];
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
        StateGroup.prototypesSet(instanceAsObject.stateGroup);
        instanceAsObject.commands.forEach((x) => Command.prototypesSet(x));
    }
}
