"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Command {
            constructor(texts, scriptExecuteName) {
                this.texts = texts;
                this.scriptExecuteName = scriptExecuteName;
            }
            static fromTextsAndScriptExecute(texts, scriptExecute) {
                var returnValue = new Command(texts, scriptExecute.name);
                returnValue._scriptExecute = scriptExecute;
                return returnValue;
            }
            static fromTextAndCommands(commandTextToMatch, commands) {
                var commandsMatching = commands.filter(command => command.texts.some(text => commandTextToMatch.startsWith(text)));
                var commandMatching;
                if (commandsMatching.length == 0) {
                    commandMatching = commands.find(x => x.text() == "unrecognized");
                    commandMatching = commandMatching.clone().textSet(commandTextToMatch);
                }
                else {
                    var commandMatchingExactly = commands.find(command => command.texts.some(text => text == commandTextToMatch));
                    if (commandMatchingExactly == null) {
                        var commandTextMatchingLongestSoFar = "";
                        for (var c = 0; c < commandsMatching.length; c++) {
                            var commandMatching = commandsMatching[c];
                            var commandTextMatching = commandMatching.texts.find(x => commandTextToMatch.startsWith(x));
                            if (commandTextMatching.length > commandTextMatchingLongestSoFar.length) {
                                commandTextMatchingLongestSoFar =
                                    commandTextMatching;
                                commandMatching = commandsMatching[c];
                            }
                        }
                    }
                    else {
                        commandMatching = commandMatchingExactly;
                    }
                    commandMatching = commandMatching.clone();
                    commandMatching.textSet(commandTextToMatch);
                }
                return commandMatching;
            }
            static Instances() {
                if (Command._instances == null) {
                    Command._instances = new Command_Instances();
                }
                return Command._instances;
            }
            static cleanCommandText(commandText) {
                var termsToIgnore = [
                    "in",
                    "into",
                    "to",
                    "through",
                    "toward"
                ];
                for (var i = 0; i < termsToIgnore.length; i++) {
                    var term = termsToIgnore[i];
                    commandText = commandText.split(term + " ").join("");
                }
                return commandText;
            }
            scriptExecute(world) {
                return world.scriptByName(this.scriptExecuteName);
            }
            execute(universe, world, place, command) {
                var message = "Command entered: " + this.text() + "\n";
                universe.messageEnqueue(message);
                var scriptExecute = this.scriptExecute(world);
                scriptExecute.run(universe, world, place, this);
            }
            text() {
                return this.texts[0];
            }
            textSet(value) {
                this.texts[0] = value;
                return this;
            }
            // Clonable.
            clone() {
                return new Command(this.texts.map(x => x), this.scriptExecuteName);
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, Command.prototype);
            }
        }
        TextAdventureEngine.Command = Command;
        class Command_Instances {
            constructor() {
                this.AttackSomething = Command.fromTextsAndScriptExecute([
                    "attack ", "fight ", "kill ", "destroy ", "punch ",
                    "kick ", "strike ", "bash ", "smash ", "break "
                ], new TextAdventureEngine.Script("AttackSomething", this.attackSomething));
                this.BuySomething = Command.fromTextsAndScriptExecute(["give "], new TextAdventureEngine.Script("BuySomething", this.buySomething));
                this.DropSomething = Command.fromTextsAndScriptExecute(["drop ", "discard", "dump "], new TextAdventureEngine.Script("DropSomething", this.dropSomething));
                this.GetSomething = Command.fromTextsAndScriptExecute(["get ", "take ", "grab "], new TextAdventureEngine.Script("GetSomething", this.getSomething));
                this.GiveSomething = Command.fromTextsAndScriptExecute(["give "], new TextAdventureEngine.Script("GiveSomething", this.giveSomething));
                this.GoDirectionEast = Command.fromTextsAndScriptExecute(["e", "east", "go e",], new TextAdventureEngine.Script("GoEast", this.goDirectionEast.bind(this)));
                this.GoDirectionNorth = Command.fromTextsAndScriptExecute(["n", "north", "go n"], new TextAdventureEngine.Script("GoNorth", this.goDirectionNorth.bind(this)));
                this.GoDirectionSouth = Command.fromTextsAndScriptExecute(["s", "south", "go s"], new TextAdventureEngine.Script("GoSouth", this.goDirectionSouth.bind(this)));
                this.GoDirectionWest = Command.fromTextsAndScriptExecute(["w", "west", "go w"], new TextAdventureEngine.Script("GoWest", this.goDirectionWest.bind(this)));
                this.GoSomewhere = Command.fromTextsAndScriptExecute(["go ", "walk ", "run ", "go to", "go through"], new TextAdventureEngine.Script("GoSomewhere", this.goSomewhere));
                this.Help = Command.fromTextsAndScriptExecute(["?", "help"], new TextAdventureEngine.Script("Help", this.help));
                this.InventoryView = Command.fromTextsAndScriptExecute(["inventory", "look at possessions"], new TextAdventureEngine.Script("InventoryView", this.inventoryView));
                this.LockOrUnlockSomething = Command.fromTextsAndScriptExecute(["lock ", "unlock "], new TextAdventureEngine.Script("LockOrUnlockSomething", this.lockOrUnlockSomething));
                this.LookAround = Command.fromTextsAndScriptExecute(["look around", "examine room", "examine surroundings"], new TextAdventureEngine.Script("LookAround", this.lookAround));
                this.LookAtSomething = Command.fromTextsAndScriptExecute(["look at ", "examine ", "watch ", "view "], new TextAdventureEngine.Script("LookAtSomething", this.lookAtSomething));
                this.LookSomewhere = Command.fromTextsAndScriptExecute(["look "], new TextAdventureEngine.Script("LookSomewhere", this.lookAtSomething) // hack
                );
                this.MoveSomething = Command.fromTextsAndScriptExecute(["push ", "pull ", "press ", "slide ", "lift ", "raise ", "lower ", "turn ", "twist "], new TextAdventureEngine.Script("MoveSomething", this.moveSomething));
                this.OpenSomething = Command.fromTextsAndScriptExecute(["open "], new TextAdventureEngine.Script("OpenSomething", this.openSomething));
                this.Quit = Command.fromTextsAndScriptExecute(["quit"], new TextAdventureEngine.Script("Quit", this.quit));
                this.Restart = Command.fromTextsAndScriptExecute(["restart"], new TextAdventureEngine.Script("Restart", this.restart));
                this.SaySomething = Command.fromTextsAndScriptExecute(["say ", "shout ", "yell ", "whisper "], new TextAdventureEngine.Script("SaySomething", this.saySomething));
                this.SearchSomething = Command.fromTextsAndScriptExecute(["search "], new TextAdventureEngine.Script("search ", this.searchSomething));
                this.SellSomething = Command.fromTextsAndScriptExecute(["sell "], new TextAdventureEngine.Script("SellSomething", this.sellSomething));
                this.StateDelete = Command.fromTextsAndScriptExecute(["delete "], new TextAdventureEngine.Script("StateDelete", this.stateDelete));
                this.StateLoad = Command.fromTextsAndScriptExecute(["load ", "restore "], new TextAdventureEngine.Script("StateLoad", this.stateLoad));
                this.StateSave = Command.fromTextsAndScriptExecute(["save "], new TextAdventureEngine.Script("StateSave", this.stateSave));
                this.StatesList = Command.fromTextsAndScriptExecute(["list saves"], new TextAdventureEngine.Script("StatesList", this.statesList));
                this.TalkToSomething = Command.fromTextsAndScriptExecute(["talk to ", "talk with "], new TextAdventureEngine.Script("TalkToSomething", this.talkToSomething));
                this.Unrecognized = Command.fromTextsAndScriptExecute(["unrecognized"], new TextAdventureEngine.Script("Unrecognized", this.unrecognized));
                this.UseSomething = Command.fromTextsAndScriptExecute(["use ", "activate "], new TextAdventureEngine.Script("UseSomething", this.useSomething));
                this.Wait = Command.fromTextsAndScriptExecute(["wait"], new TextAdventureEngine.Script("Wait", this.wait));
                this._All =
                    [
                        this.AttackSomething,
                        this.BuySomething,
                        this.DropSomething,
                        this.GetSomething,
                        this.GiveSomething,
                        this.GoDirectionEast,
                        this.GoDirectionNorth,
                        this.GoDirectionSouth,
                        this.GoDirectionWest,
                        this.GoSomewhere,
                        this.Help,
                        this.InventoryView,
                        this.LockOrUnlockSomething,
                        this.LookAround,
                        this.LookAtSomething,
                        this.LookSomewhere,
                        this.MoveSomething,
                        this.OpenSomething,
                        this.Quit,
                        this.Restart,
                        this.SaySomething,
                        this.SearchSomething,
                        this.SellSomething,
                        this.StateDelete,
                        this.StateSave,
                        this.StateLoad,
                        this.StatesList,
                        this.TalkToSomething,
                        this.Unrecognized,
                        this.UseSomething,
                        this.Wait
                    ];
            }
            attackSomething(universe, world, place, command) {
                universe.messageEnqueue("You can attack something by using a weapon on it.");
            }
            buySomething(universe, world, place, command) {
                universe.messageEnqueue("todo");
            }
            dropSomething(universe, world, place, command) {
                var commandText = command.text();
                var targetName = commandText.substr(commandText.indexOf(" ") + 1);
                var message = null;
                var player = world.player;
                var itemToDrop = player.items.find(x => x.name == targetName);
                if (itemToDrop == null) {
                    message = "You don't have any " + targetName + ".";
                }
                else {
                    message = "You drop the " + itemToDrop.name + ".";
                    player.itemRemove(itemToDrop);
                    place = world.placeCurrent();
                    place.itemAdd(itemToDrop);
                }
                universe.messageEnqueue(message);
            }
            getSomething(universe, world, place, command) {
                var commandText = command.text();
                var targetName = commandText.substr(commandText.indexOf(" ") + 1);
                var message = null;
                place = world.placeCurrent();
                var emplacementToGet = place.emplacements.find(x => x.name == targetName);
                if (emplacementToGet != null) {
                    message = "The " + emplacementToGet.name + " cannot be picked up.";
                }
                else {
                    var agentToGet = place.agents.find(x => x.name == targetName);
                    if (agentToGet != null) {
                        message = "The " + agentToGet.name + " cannot be picked up.";
                    }
                    else {
                        var player = world.player;
                        var itemToGet = place.items.find(x => x.name == targetName);
                        if (itemToGet == null) {
                            var itemAlreadyCarried = player.itemByName(targetName);
                            if (itemAlreadyCarried == null) {
                                message = "You don't see any " + targetName + " here.";
                            }
                            else {
                                message = "You're already carrying the " + targetName + ".";
                            }
                        }
                        else {
                            message = "You take the " + itemToGet.name + ".";
                            place.itemRemove(itemToGet);
                            world.player.itemAdd(itemToGet);
                        }
                    }
                }
                universe.messageEnqueue(message);
            }
            giveSomething(universe, world, place, command) {
                var message;
                var commandText = command.text();
                var commandTextMinusVerb = commandText.substring("give ".length);
                var textTo = " to ";
                var indexOfTo = commandTextMinusVerb.indexOf(textTo);
                if (indexOfTo < 0) {
                    message = "You must specify a recipient to give it to.";
                }
                else {
                    var itemToGiveName = commandTextMinusVerb.substr(0, indexOfTo);
                    var itemToGive = world.player.itemByName(itemToGiveName);
                    if (itemToGive == null) {
                        message = "You don't have any " + itemToGive + ".";
                    }
                    else {
                        var recipientName = commandTextMinusVerb.substr(indexOfTo + textTo.length);
                        var agents = place.agents;
                        var recipient = agents.find(x => x.name == recipientName);
                        if (recipient == null) {
                            message = "You don't see any " + recipientName + " here.";
                        }
                        else {
                            message = "todo";
                        }
                    }
                }
                universe.messageEnqueue(message);
            }
            goDirectionEast(universe, world, place, command) {
                Command.Instances().goThroughPortalWithName(universe, world, "east");
            }
            goDirectionNorth(universe, world, place, command) {
                Command.Instances().goThroughPortalWithName(universe, world, "north");
            }
            goDirectionSouth(universe, world, place, command) {
                Command.Instances().goThroughPortalWithName(universe, world, "south");
            }
            goDirectionWest(universe, world, place, command) {
                Command.Instances().goThroughPortalWithName(universe, world, "west");
            }
            goSomewhere(universe, world, place, command) {
                var commandText = Command.cleanCommandText(command.text());
                var portalNameFromCommand = commandText.substr(commandText.indexOf(" ") + 1);
                Command.Instances().goThroughPortalWithName(universe, world, portalNameFromCommand);
            }
            goThroughPortalWithName(universe, world, portalName) {
                var place = world.placeCurrent();
                var portals = place.portals;
                var portalMatchingName = portals.find((x) => x.name == portalName);
                if (portalMatchingName == null) {
                    universe.messageEnqueue("You can't go " + portalName + " here.");
                }
                else {
                    var placeNextName = portalMatchingName.placeDestinationName;
                    var placeNext = world.placeByName(placeNextName);
                    world.placeCurrentSet(placeNext);
                }
            }
            help(universe, world, place, command) {
                var helpTextAsLines = [
                    "To play, type a command and press the Enter key.",
                    "",
                    "Recognized commands include:",
                    "",
                    "? - This text is displayed.",
                    "delete <name> - Deletes the specified saved game.",
                    "look around - The player examines the surroundings.",
                    "look <name>, look at <name> - The player examines a particular thing.",
                    "go <name> - The player attempts to leave the area by the specified exit.",
                    "get <name> - The player attempts to pick up the item named.",
                    "inventory - Displays a list of the player's possessions.",
                    "list saves - Lists saved game states.",
                    "quit - Quit the game.",
                    "load <name> - Loads the saved game with the specified name.",
                    "restart - Restarts the game.",
                    "save <name> - Saves the game using the specified name.",
                    "talk to <name> - The player attempts to talk to someone or something.",
                    "use <name> - The player attempts to use something.",
                    "use <name> on <name2> - The player attempts to use something on something.",
                    "wait - The player does nothing, and simply waits for something to happen."
                ];
                var helpText = helpTextAsLines.join("\n");
                universe.messageEnqueue(helpText);
            }
            inventoryView(universe, world, place, command) {
                var player = world.player;
                var items = player.items;
                var linesToWrite = [
                    "Items Carried:"
                ];
                items.forEach(x => linesToWrite.push(x.name));
                var message = linesToWrite.join("\n");
                universe.messageEnqueue(message);
            }
            lockOrUnlockSomething(universe, world, place, command) {
                universe.messageEnqueue("You can lock or unlock things with keyholes by using the right key on them.");
            }
            lookAround(universe, world, place, command) {
                place = world.placeCurrent();
                universe.messageEnqueue(place.description);
            }
            lookAtSomething(universe, world, place, command) {
                var commandText = command.text();
                var textAt = " at ";
                var indexOfAt = commandText.indexOf(textAt);
                var targetName;
                if (indexOfAt < 0) {
                    targetName =
                        commandText.substr(commandText.indexOf(" ") + 1);
                }
                else {
                    targetName =
                        commandText.substr(indexOfAt + textAt.length);
                }
                var targetDescription = null;
                var player = world.player;
                var playerItems = player.items;
                place = world.placeCurrent();
                var targetsPossibleArrays = [
                    playerItems,
                    place.portals,
                    place.emplacements,
                    place.items,
                    place.agents
                ];
                for (var ta = 0; ta < targetsPossibleArrays.length; ta++) {
                    var targetsPossible = targetsPossibleArrays[ta];
                    for (var i = 0; i < targetsPossible.length; i++) {
                        var targetFound = targetsPossible.find((x) => x.name == targetName);
                        if (targetFound != null) {
                            targetDescription = targetFound.description;
                            break;
                        }
                    }
                    if (targetDescription != null) {
                        break;
                    }
                }
                if (targetDescription == null) {
                    targetDescription = "You don't see any " + targetName + " here.";
                }
                universe.messageEnqueue(targetDescription);
            }
            moveSomething(universe, world, place, command) {
                var commandText = command.text();
                var verbUsed = commandText.split(" ")[0];
                universe.messageEnqueue("You cannot " + verbUsed + " that.");
            }
            openSomething(universe, world, place, command) {
                universe.messageEnqueue("You can open containers by using them, or things like doors by just going there.");
            }
            quit(universe, world, place, command) {
                universe.messageEnqueue("Quitting.  The game is now over.");
                world.isOver = true;
            }
            restart(universe, world, place, command) {
                universe.messageEnqueue("Restarting.");
                universe.world = universe.worldCreate();
            }
            saySomething(universe, world, place, command) {
                var commandText = command.text();
                var thingToSay = commandText.substr(commandText.indexOf(" ") + 1);
                universe.messageEnqueue("You say, '" + thingToSay + "'.  There is no response.");
            }
            searchSomething(universe, world, place, command) {
                universe.messageEnqueue("You can search objects by using them, or sometimes by just looking at them.");
            }
            sellSomething(universe, world, place, command) {
                universe.messageEnqueue("todo");
            }
            stateDelete(universe, world, place, command) {
                var commandText = command.text();
                var stateName = commandText.substr(commandText.indexOf(" ") + 1);
                var saveStateManager = universe.saveStateManager;
                try {
                    saveStateManager.saveStateDeleteByName(stateName);
                    universe.messageEnqueue("Deleted state with name '" + stateName + "'.");
                }
                catch (ex) {
                    universe.messageEnqueue("Error during delete: " + ex.message);
                }
            }
            stateLoad(universe, world, place, command) {
                var commandText = command.text();
                var stateName = commandText.substr(commandText.indexOf(" ") + 1);
                var saveStateManager = universe.saveStateManager;
                try {
                    saveStateManager.saveStateLoadByName(stateName);
                    // The world.scripts field cannot be easily or efficiently serialized,
                    // so it will instead be copied from the old instance of World.
                    universe.world.scripts = world.scripts;
                    universe.messageEnqueue("Loaded state with name '" + stateName + "'.");
                }
                catch (ex) {
                    universe.messageEnqueue("Error during load: " + ex.message);
                }
            }
            stateSave(universe, world, place, command) {
                var commandText = command.text();
                var stateName = commandText.substr(commandText.indexOf(" ") + 1);
                var stateToSave = new TextAdventureEngine.SaveState(stateName, universe.world);
                var saveStateManager = universe.saveStateManager;
                try {
                    saveStateManager.saveStateSave(stateToSave);
                    universe.messageEnqueue("Saved state with name '" + stateName + "'.");
                }
                catch (ex) {
                    universe.messageEnqueue("Error during save: " + ex.message);
                }
            }
            statesList(universe, world, place, command) {
                var saveStateNames = universe.saveStateManager.saveStateNamesGet();
                var message = "Saved States:\n\n"
                    + saveStateNames.join("\n")
                    + "\n\n"
                    + saveStateNames.length + " states currently saved.";
                universe.messageEnqueue(message);
            }
            talkToSomething(universe, world, place, command) {
                var message = null;
                var commandText = command.text();
                var targetName = commandText.substr("talk to ".length);
                place = world.placeCurrent();
                var emplacementToTalkTo = place.emplacements.find(x => x.name == targetName);
                if (emplacementToTalkTo != null) {
                    message = "The " + emplacementToTalkTo.name + " says nothing.";
                }
                else {
                    var itemToTalkTo = place.items.find(x => x.name == targetName);
                    if (itemToTalkTo != null) {
                        message = "The " + itemToTalkTo.name + " says nothing.";
                    }
                    else {
                        var agentToTalkTo = place.agents.find(x => x.name == targetName);
                        if (agentToTalkTo == null) {
                            message = "You don't see any " + targetName + " here.";
                        }
                        else {
                            message = "The " + agentToTalkTo.name + " says nothing.";
                        }
                    }
                }
                universe.messageEnqueue(message);
            }
            unrecognized(universe, world, place, command) {
                universe.messageEnqueue("Unrecognized command: '" + command.text() + "'.");
            }
            useSomething(universe, world, place, command) {
                var message = null;
                var commandText = command.text();
                var objectName;
                var textOn = " on ";
                var indexOfOn = commandText.indexOf(" on ");
                if (indexOfOn < 0) {
                    objectName = commandText.substring("use ".length);
                }
                else {
                    objectName = commandText.substr(0, indexOfOn).split(" ")[1];
                }
                var objectToUse = null;
                place = world.placeCurrent();
                var emplacementToUse = place.emplacements.find((x) => x.name == objectName);
                if (emplacementToUse != null) {
                    objectToUse = emplacementToUse;
                }
                else {
                    var agentToUse = place.agents.find((x) => x.name == objectName);
                    if (agentToUse != null) {
                        message = "The " + agentToUse.name + " cannot be used.";
                    }
                    else {
                        var playerItems = world.player.items;
                        var itemCarriedToUse = playerItems.find((x) => x.name == objectName);
                        if (itemCarriedToUse != null) {
                            objectToUse = itemCarriedToUse;
                        }
                        else {
                            var itemInRoomToUse = place.items.find((x) => x.name == objectName);
                            if (itemInRoomToUse == null) {
                                message = "You don't see any " + objectName + " here.";
                            }
                            else {
                                objectToUse = itemInRoomToUse;
                            }
                        }
                    }
                }
                if (objectToUse == null) {
                    universe.messageEnqueue(message);
                }
                else if (objectToUse.canBeUsed() == false) {
                    message = "The " + objectToUse.name + " cannot be used.";
                    universe.messageEnqueue(message);
                }
                else {
                    var target = null;
                    if (indexOfOn >= 0) {
                        var targetToUseObjectOnName = commandText.substr(indexOfOn + textOn.length);
                        if (targetToUseObjectOnName != null) {
                            var player = world.player;
                            target = player.itemByName(targetToUseObjectOnName);
                            if (target == null) {
                                target = place.objectByName(targetToUseObjectOnName);
                                if (target == null) {
                                    universe.messageEnqueue("You don't see any " + targetToUseObjectOnName + " here.");
                                    objectToUse = null;
                                }
                            }
                        }
                    }
                    if (objectToUse != null) {
                        if (target == objectToUse) {
                            universe.messageEnqueue("That cannot be used on itself!");
                        }
                        else {
                            objectToUse.use(universe, world, place, target);
                        }
                    }
                }
            }
            wait(universe, world, place, command) {
                universe.messageEnqueue("You wait a moment.");
            }
        }
        TextAdventureEngine.Command_Instances = Command_Instances;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
