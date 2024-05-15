"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Portal {
            constructor(names, description, placeDestinationName, scriptUseName, stateGroup) {
                this.names = names;
                this.description = description;
                this.placeDestinationName = placeDestinationName;
                this.scriptUseName = scriptUseName;
                this.stateGroup = stateGroup || TextAdventureEngine.StateGroup.create();
            }
            static fromNameAndPlaceDestinationName(name, placeDestinationName) {
                return Portal.fromNamesAndPlaceDestinationName([name], placeDestinationName);
            }
            static fromNamesAndPlaceDestinationName(names, placeDestinationName) {
                return new Portal(names, null, placeDestinationName, null, null);
            }
            goThrough(universe, world) {
                var placeNextName = this.placeDestinationName;
                var placeNext = world.placeByName(placeNextName);
                world.placeCurrentSet(placeNext);
            }
            use(universe, world, place) {
                if (this.scriptUseName == null) {
                    this.goThrough(universe, world);
                }
                else {
                    var scriptUse = world.scriptByName(this.scriptUseName);
                    scriptUse.run(universe, world, place, this);
                }
            }
            // Clonable.
            clone() {
                return new Portal(this.names.map(x => x), this.description, this.placeDestinationName, this.scriptUseName, this.stateGroup.clone());
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, Portal.prototype);
            }
            // States.
            locked() {
                return this.stateWithNameIsTrue("Locked");
            }
            lockedSet() {
                return this.stateWithNameSetToTrue("Locked");
            }
            stateWithNameGetValue(stateToGetName) {
                return this.stateGroup.stateWithNameGetValue(stateToGetName);
            }
            stateWithNameIsTrue(stateName) {
                return (this.stateWithNameGetValue(stateName) == true);
            }
            stateWithNameSetToValue(stateToSetName, valueToSet) {
                this.stateGroup.stateWithNameSetToValue(stateToSetName, valueToSet);
                return this;
            }
            stateWithNameSetToTrue(stateToSetName) {
                return this.stateWithNameSetToValue(stateToSetName, true);
            }
            visible() {
                return this.stateWithNameIsTrue("Visible");
            }
            visibleSet(value) {
                return this.stateWithNameSetToTrue("Visible");
            }
        }
        TextAdventureEngine.Portal = Portal;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
