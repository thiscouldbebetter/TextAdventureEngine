"use strict";
class SaveStateManager {
    constructor(universe) {
        this.universe = universe;
        this.saveStates = new Array();
    }
    saveStateDeleteByName(stateName) {
        if (this.saveStates.some(x => x.name == stateName) == false) {
            throw new Error("No saved state was found with name '" + stateName + "'.");
        }
        else {
            var saveState = this.saveStates.find(x => x.name == stateName);
            this.saveStates.splice(this.saveStates.indexOf(saveState), 1);
        }
    }
    saveStateLoadByName(stateName) {
        if (this.saveStates.some(x => x.name == stateName) == false) {
            throw new Error("No saved state was found with name '" + stateName + "'.");
        }
        else {
            var state = this.saveStates.find(x => x.name == stateName);
            var worldToLoad = state.world.clone();
            this.universe.world = worldToLoad;
        }
    }
    saveStateNamesGet() {
        return this.saveStates.map(x => x.name);
    }
    saveStateSave(saveStateToSave) {
        var stateName = saveStateToSave.name;
        if (this.saveStates.some(x => x.name == stateName)) {
            throw new Error("Could not save, because an existing saved state was found with name '" + stateName + "'.");
        }
        else {
            this.saveStates.push(saveStateToSave);
        }
    }
}
