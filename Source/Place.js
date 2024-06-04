"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Place {
            constructor(name, description, scriptUpdateForTurn, portals, emplacements, items, agents, stateGroup) {
                this.name = name;
                this.description = description;
                this._scriptUpdateForTurn = scriptUpdateForTurn;
                this.portals = portals || [];
                this.emplacements = emplacements || [];
                this.items = items || [];
                this.agents = agents || [];
                this.stateGroup = stateGroup || new TextAdventureEngine.StateGroup([]);
            }
            static fromNameAndDescription(name, description) {
                return new Place(name, description, null, null, null, null, null, null);
            }
            static fromNameDescriptionAndObjects(name, description, objects) {
                return new Place(name, description, null, // scriptUpdateForTurn
                objects.filter(x => x.constructor.name == TextAdventureEngine.Portal.name), objects.filter(x => x.constructor.name == TextAdventureEngine.Emplacement.name), objects.filter(x => x.constructor.name == TextAdventureEngine.Item.name), objects.filter(x => x.constructor.name == TextAdventureEngine.Agent.name), null // stateGroup
                );
            }
            static fromNameDescriptionAndScriptName(name, description, scriptUpdateForTurn) {
                return new Place(name, description, scriptUpdateForTurn.clone(), null, null, null, null, null);
            }
            static fromNameDescriptionScriptNameAndObjects(name, description, scriptUpdateForTurn, objects) {
                return new Place(name, description, scriptUpdateForTurn, objects.filter(x => x.constructor.name == TextAdventureEngine.Portal.name), objects.filter(x => x.constructor.name == TextAdventureEngine.Emplacement.name), objects.filter(x => x.constructor.name == TextAdventureEngine.Item.name), objects.filter(x => x.constructor.name == TextAdventureEngine.Agent.name), null);
            }
            agentAdd(agent, world) {
                this.agents.push(agent);
                var region = this.region(world);
                region.agentAdd(agent);
            }
            agentByName(name) {
                return this.agents.find(x => x.names.indexOf(name) >= 0);
            }
            agentRemove(agent, world) {
                this.agents.splice(this.agents.indexOf(agent), 1);
                this.region(world).agentRemove(agent);
            }
            commands() {
                var commandsAll = new Array();
                this.emplacements.forEach(x => commandsAll.push(...x.commands));
                this.items.forEach(x => commandsAll.push(...x.commands));
                this.agents.forEach(x => commandsAll.push(...x.commands()));
                return commandsAll;
            }
            descriptionIncludingObjects() {
                var placeAndObjectDescriptions = [
                    this.description
                ];
                var emplacementDescriptions = this.emplacements.map(x => x.descriptionAsPartOfPlace).filter(x => x != null);
                placeAndObjectDescriptions.push(...emplacementDescriptions);
                var blankLine = "\n\n";
                var placeDescriptionIncludingObjects = placeAndObjectDescriptions.join(blankLine);
                return placeDescriptionIncludingObjects;
            }
            draw(universe, world) {
                var linesToWrite = [
                    "Location: " + this.name
                ];
                var hasBeenVisited = this.hasBeenVisited();
                if (hasBeenVisited == false) {
                    var descriptionIncludingObjects = this.descriptionIncludingObjects();
                    linesToWrite.push(descriptionIncludingObjects);
                }
                this.visit(); // hack
                var objectArraysPresent = [
                    this.emplacements,
                    this.items,
                    this.agents
                ];
                for (var oa = 0; oa < objectArraysPresent.length; oa++) {
                    var objects = objectArraysPresent[oa];
                    for (var i = 0; i < objects.length; i++) {
                        var objectToMention = objects[i];
                        var objectIsVisible = objectToMention.visible();
                        if (objectIsVisible) {
                            var message = objectToMention.descriptionAsPartOfPlace;
                            if (message != null) {
                                linesToWrite.push(message);
                            }
                        }
                    }
                }
                var message = linesToWrite.join("\n\n") + "\n";
                return message;
            }
            emplacementAdd(emplacement) {
                this.emplacements.push(emplacement);
            }
            emplacementByName(name) {
                return this.emplacements.find(x => x.namesInclude(name));
            }
            emplacementRemove(emplacement) {
                this.emplacements.splice(this.emplacements.indexOf(emplacement), 1);
                return this;
            }
            emplacementWithNameRemove(name) {
                var emplacementToRemove = this.emplacementByName(name);
                if (emplacementToRemove != null) {
                    this.emplacementRemove(emplacementToRemove);
                }
                return this;
            }
            itemAdd(item) {
                this.items.push(item);
                return this;
            }
            itemsAdd(itemsToAdd) {
                this.items.push(...itemsToAdd);
                return this;
            }
            itemByName(name) {
                var itemsPlusContents = this.itemsPlusContents();
                var itemFound = itemsPlusContents.find(x => x.names.indexOf(name) >= 0);
                return itemFound;
            }
            itemRemove(item) {
                this.items.splice(this.items.indexOf(item), 1);
            }
            itemsPlusContents() {
                var itemsPlusContents = new Array();
                itemsPlusContents.push(...this.items);
                // Only get the contents of top-level containers,
                // not containers of containers.
                this.items.forEach(x => itemsPlusContents.push(...x.items));
                return itemsPlusContents;
            }
            objectByName(name) {
                var objectFound = null;
                var objectArrays = [
                    this.portals,
                    this.emplacements,
                    this.items,
                    this.agents
                ];
                var objectArray = objectArrays.find(oa => oa.some((x) => x.name == name));
                if (objectArray != null) {
                    objectFound = objectArray.find((x) => x.name == name);
                }
                return objectFound;
            }
            portalByName(name) {
                return this.portalsByName(name)[0];
            }
            portalsByName(name) {
                return this.portals.filter(x => x.namesInclude(name));
            }
            portalsVisible() {
                return this.portals.filter(x => x.visible());
            }
            region(world) {
                return world.regionByPlace(this);
            }
            scriptUpdateForTurn(world) {
                return this._scriptUpdateForTurn;
            }
            updateForTurn(universe, world) {
                var region = this.region(world);
                region.updateForTurn(universe, world);
                var scriptUpdateForTurn = this.scriptUpdateForTurn(world);
                if (scriptUpdateForTurn != null) {
                    scriptUpdateForTurn.run(universe, world, this, null, null);
                }
                this.items.forEach(x => x.updateForTurn(universe, world, this));
            }
            // Clonable.
            clone() {
                return new Place(this.name, this.description, this._scriptUpdateForTurn.clone(), this.portals.map(x => x.clone()), this.emplacements.map(x => x.clone()), this.items.map(x => x.clone()), this.agents.map(x => x.clone()), this.stateGroup.clone());
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, Place.prototype);
                instanceAsObject.portals.forEach((x) => TextAdventureEngine.Portal.prototypesSet(x));
                instanceAsObject.emplacements.forEach((x) => TextAdventureEngine.Emplacement.prototypesSet(x));
                instanceAsObject.items.forEach((x) => TextAdventureEngine.Item.prototypesSet(x));
                instanceAsObject.agents.forEach((x) => TextAdventureEngine.Agent.prototypesSet(x));
                TextAdventureEngine.StateGroup.prototypesSet(instanceAsObject.stateGroup);
            }
            // States.
            hasBeenVisited() {
                return this.stateGroup.stateWithNameIsTrue("Visited");
            }
            visit() {
                this.stateGroup.stateWithNameSetToTrue("Visited");
            }
        }
        TextAdventureEngine.Place = Place;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
