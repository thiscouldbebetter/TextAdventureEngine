"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class SaveStateManager {
            constructor(universe, storageManager) {
                this.universe = universe;
                this.storageManager = storageManager;
            }
            static delimiter() {
                return "|";
            }
            static storageManagerKeyForSaveStateList() {
                var delimiter = SaveStateManager.delimiter();
                return delimiter + "SaveStateNameList";
            }
            saveStateDeleteByName(stateName) {
                if (this.storageManager.valueExistsForKey(stateName) == false) {
                    throw new Error("No saved state was found with name '" + stateName + "'.");
                }
                else {
                    this.storageManager.valueDeleteByKey(stateName);
                }
            }
            saveStateLoadByName(stateName) {
                if (this.storageManager.valueExistsForKey(stateName) == false) {
                    throw new Error("No saved state was found with name '" + stateName + "'.");
                }
                else {
                    var stateAsString = this.storageManager.valueGetByKey(stateName);
                    var state = TextAdventureEngine.SaveState.fromString(stateAsString);
                    var worldToLoad = state.world.clone();
                    this.universe.world = worldToLoad;
                }
            }
            saveStateNamesGet() {
                var saveStateNamesAsString = this.storageManager.valueGetByKey(SaveStateManager.storageManagerKeyForSaveStateList());
                var delimiter = SaveStateManager.delimiter();
                var saveStateNames = saveStateNamesAsString.split(delimiter);
                return saveStateNames;
            }
            saveStateSave(saveStateToSave) {
                var stateName = saveStateToSave.name;
                var delimiter = SaveStateManager.delimiter();
                if (stateName.indexOf(delimiter) >= 0) {
                    throw new Error("Save state names may not include the character '" + delimiter + ".");
                }
                if (this.storageManager.valueExistsForKey(stateName)) {
                    throw new Error("Could not save, because an existing saved state was found with name '" + stateName + "'.");
                }
                else {
                    var saveStateAsString = saveStateToSave.toString();
                    this.storageManager.keyAndValueSave(stateName, saveStateAsString);
                }
            }
        }
        TextAdventureEngine.SaveStateManager = SaveStateManager;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
