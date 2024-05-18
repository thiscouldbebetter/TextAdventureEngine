"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Portal {
            constructor(names, description, placeDestinationName, scriptUseName, visible, stateGroup) {
                this.names = names;
                this.description = description;
                this.placeDestinationName = placeDestinationName;
                this.scriptUseName = scriptUseName;
                this._visible = visible || true;
                this.stateGroup = stateGroup || TextAdventureEngine.StateGroup.create();
            }
            static fromNameAndPlaceDestinationName(name, placeDestinationName) {
                return Portal.fromNamesAndPlaceDestinationName([name], placeDestinationName);
            }
            static fromNamesAndPlaceDestinationName(names, placeDestinationName) {
                return new Portal(names, null, placeDestinationName, null, true, null);
            }
            descriptionSet(value) {
                this.description = value;
                return this;
            }
            name() {
                return this.names[0];
            }
            namesInclude(nameToMatch) {
                return this.names.indexOf(nameToMatch) >= 0;
            }
            goThrough(universe, world) {
                var portalIsLocked = this.locked();
                if (portalIsLocked) {
                    universe.messageEnqueue("That way is not currently passable.");
                }
                else {
                    var placeNextName = this.placeDestinationName;
                    var placeNext = world.placeByName(placeNextName);
                    world.placeCurrentSet(placeNext);
                }
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
                return new Portal(this.names.map(x => x), this.description, this.placeDestinationName, this.scriptUseName, this._visible, this.stateGroup.clone());
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, Portal.prototype);
            }
            // States.
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
            // Locking.
            lock() {
                return this.lockedSet(true);
            }
            locked() {
                return this.stateWithNameIsTrue("Locked");
            }
            lockedSet(value) {
                return this.stateWithNameSetToValue("Locked", value);
            }
            unlock() {
                return this.lockedSet(false);
            }
            // Visibility.
            hide() {
                return this.visibleSet(false);
            }
            show() {
                return this.visibleSet(true);
            }
            visible() {
                return this._visible;
            }
            visibleSet(value) {
                this._visible = value;
                return this;
            }
        }
        TextAdventureEngine.Portal = Portal;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
