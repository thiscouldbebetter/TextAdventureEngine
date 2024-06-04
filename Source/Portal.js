"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Portal {
            constructor(names, descriptionWhenExamined, placeDestinationName, scriptUseName, visible, passable, stateGroup) {
                this.names = names;
                this.descriptionWhenExamined = descriptionWhenExamined;
                this.placeDestinationName = placeDestinationName;
                this.scriptUseName = scriptUseName;
                this._visible = visible || true;
                this._passable = passable || false;
                this.stateGroup = stateGroup || TextAdventureEngine.StateGroup.create();
            }
            static fromNameAndPlaceDestinationName(name, placeDestinationName) {
                return Portal.fromNamesAndPlaceDestinationName([name], placeDestinationName);
            }
            static fromNames(names) {
                return new Portal(names, null, null, null, true, true, null);
            }
            static fromNamesAndPlaceDestinationName(names, placeDestinationName) {
                return Portal
                    .fromNames(names)
                    .placeDestinationNameSet(placeDestinationName);
            }
            static fromNamesDescriptionAndPlaceDestinationName(names, descriptionWhenExamined, placeDestinationName) {
                return Portal
                    .fromNames(names)
                    .descriptionWhenExaminedSet(descriptionWhenExamined)
                    .placeDestinationNameSet(placeDestinationName);
            }
            descriptionWhenExaminedSet(value) {
                this.descriptionWhenExamined = value;
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
            placeDestinationNameSet(value) {
                this.placeDestinationName = value;
                return this;
            }
            scriptUseNameSet(value) {
                this.scriptUseName = value;
                return this;
            }
            use(universe, world, place) {
                if (this.scriptUseName == null) {
                    this.goThrough(universe, world);
                }
                else {
                    var scriptUse = world.scriptByName(this.scriptUseName);
                    scriptUse.run(universe, world, place, this, null);
                }
            }
            // Clonable.
            clone() {
                return new Portal(this.names.map(x => x), this.descriptionWhenExamined, this.placeDestinationName, this.scriptUseName, this._visible, this._passable, this.stateGroup.clone());
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
            // Blocking.
            block() {
                this._passable = false;
                return this;
            }
            blocked() {
                return (this._passable == false);
            }
            passable() {
                return this._passable;
            }
            unblock() {
                this._passable = true;
                return this;
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
