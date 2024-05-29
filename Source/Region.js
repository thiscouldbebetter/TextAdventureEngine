"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Region {
            constructor(name, scriptUpdateForTurnName, stateGroup, places, agents) {
                this.name = name;
                this.scriptUpdateForTurnName = scriptUpdateForTurnName;
                this.stateGroup = stateGroup || TextAdventureEngine.StateGroup.create();
                this.places = places;
                this.agents = agents || [];
            }
            static fromNameAndPlaces(name, places) {
                return new Region(name, null, null, places, null);
            }
            static fromNameScriptUpdateForTurnNameAndPlaces(name, scriptUpdateForTurnName, places) {
                return new Region(name, scriptUpdateForTurnName, null, places, null);
            }
            agentAdd(agentToAdd) {
                this.agents.push(agentToAdd);
                return this;
            }
            agentByName(name) {
                return this.agents.find(x => x.namesInclude(name));
            }
            agentRemove(agentToRemove) {
                this.agents.splice(this.agents.indexOf(agentToRemove), 1);
                return this;
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
                    var placeCurrent = world.placeCurrent();
                    scriptUpdateForTurn.run(universe, world, placeCurrent);
                }
                for (var i = 0; i < this.agents.length; i++) {
                    var agent = this.agents[i];
                    var agentPlace = agent.place(world);
                    agent.updateForTurn(universe, world, agentPlace);
                }
            }
            // Clonable.
            clone() {
                return new Region(this.name, this.scriptUpdateForTurnName, this.stateGroup.clone(), this.places.map(x => x.clone()), this.agents.map(x => x.clone()));
            }
        }
        TextAdventureEngine.Region = Region;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
