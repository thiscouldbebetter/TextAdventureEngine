"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Portal {
            constructor(name, description, placeDestinationName, scriptUseName) {
                this.name = name;
                this.description = description;
                this.placeDestinationName = placeDestinationName;
                this.scriptUseName = scriptUseName;
            }
            static fromNameAndPlaceDestinationName(name, placeDestinationName) {
                return new Portal(name, null, placeDestinationName, null);
            }
            goThrough(universe, world, place) {
                var placeNextName = this.placeDestinationName;
                var placeNext = world.placeByName(placeNextName);
                world.placeCurrentSet(placeNext);
            }
            use(universe, world, place) {
                if (this.scriptUseName == null) {
                    this.goThrough(universe, world, place);
                }
                else {
                    var scriptUse = world.scriptByName(this.scriptUseName);
                    scriptUse.run(universe, world, place, this);
                }
            }
            // Clonable.
            clone() {
                return new Portal(this.name, this.description, this.placeDestinationName, this.scriptUseName);
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, Portal.prototype);
            }
        }
        TextAdventureEngine.Portal = Portal;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
