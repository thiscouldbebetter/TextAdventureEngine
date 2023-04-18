"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class StorageManagerMemory {
            constructor() {
                this._valuesByKey = new Map();
            }
            clearAll() {
                this._valuesByKey.clear();
            }
            valueDeleteByKey(key) {
                this._valuesByKey.delete(key);
            }
            valueExistsForKey(key) {
                return this._valuesByKey.has(key);
            }
            valueGetByKey(key) {
                return this._valuesByKey.get(key);
            }
            keyAndValueSave(key, value) {
                this._valuesByKey.set(key, value);
            }
        }
        TextAdventureEngine.StorageManagerMemory = StorageManagerMemory;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
