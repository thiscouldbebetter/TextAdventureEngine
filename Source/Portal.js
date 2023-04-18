"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Portal {
            constructor(name, description, placeDestinationName) {
                this.name = name;
                this.description = description;
                this.placeDestinationName = placeDestinationName;
            }
            // Clonable.
            clone() {
                return new Portal(this.name, this.description, this.placeDestinationName);
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, Portal.prototype);
            }
        }
        TextAdventureEngine.Portal = Portal;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
