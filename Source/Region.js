"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Region {
            constructor(name, scriptUpdateForTurnName, stateGroup, places) {
                this.name = name;
                this.scriptUpdateForTurnName = scriptUpdateForTurnName;
                this.stateGroup = stateGroup || TextAdventureEngine.StateGroup.create();
                this.places = places;
            }
            static fromNameAndPlaces(name, places) {
                return new Region(name, null, null, places);
            }
            static fromNameScriptUpdateForTurnNameAndPlaces(name, scriptUpdateForTurnName, places) {
                return new Region(name, scriptUpdateForTurnName, null, places);
            }
            placeByName(placeName) {
                return this.places.find(x => x.name == placeName);
            }
            scriptUpdateForTurn(world) {
                var script = this.scriptUpdateForTurnName == null
                    ? null
                    : world.scriptByName(this.scriptUpdateForTurnName);
                return script;
            }
            updateForTurn(universe, world) {
                var scriptUpdateForTurn = this.scriptUpdateForTurn(world);
                if (scriptUpdateForTurn != null) {
                    var place = world.placeCurrent();
                    scriptUpdateForTurn.run(universe, world, place);
                }
            }
            // Clonable.
            clone() {
                return new Region(this.name, this.scriptUpdateForTurnName, this.stateGroup.clone(), this.places.map(x => x.clone()));
            }
        }
        TextAdventureEngine.Region = Region;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
