"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Script {
            constructor(name, run) {
                this.name = name;
                this.run = run;
            }
            // Clonable.
            clone() {
                return new Script(this.name, this.run // todo
                );
            }
        }
        TextAdventureEngine.Script = Script;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
