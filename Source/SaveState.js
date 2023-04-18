"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
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
                TextAdventureEngine.World.prototypesSet(instanceAsObject.world);
            }
            toString() {
                return JSON.stringify(this);
            }
        }
        TextAdventureEngine.SaveState = SaveState;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
