"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class Script {
            constructor(name, run) {
                this.name = name;
                this._run = run;
            }
            static fromName(name) {
                return new Script(name, null);
            }
            static fromNameAndRun(name, run) {
                return new Script(name, run);
            }
            run(u, w, p, x, y) {
                var run = this._run || w.scriptByName(this.name)._run;
                run(u, w, p, x, y);
            }
            // Clonable.
            clone() {
                return new Script(this.name, this._run // todo
                );
            }
            // Serialization.
            static prototypesSet(instanceAsObject) {
                Object.setPrototypeOf(instanceAsObject, Script.prototype);
                // todo - run?
            }
        }
        TextAdventureEngine.Script = Script;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
