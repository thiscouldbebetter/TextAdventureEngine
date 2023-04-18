"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Program {
            main() {
                var worldCreate = () => TextAdventureEngine.Game.worldBuild();
                var universe = TextAdventureEngine.Universe.fromWorldCreate(worldCreate);
                universe.initialize();
            }
        }
        TextAdventureEngine.Program = Program;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
