"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class InputTracker {
            constructor() {
                this._keysPressed = [];
            }
            keyPressed(event) {
                var key = event.key;
                if (this._keysPressed.indexOf(key) < 0) {
                    this._keysPressed.push(key);
                }
            }
            keyReleased(event) {
                var key = event.key;
                if (this._keysPressed.indexOf(key) >= 0) {
                    this._keysPressed.splice(this._keysPressed.indexOf(key), 1);
                }
            }
            keysPressed() {
                return this._keysPressed;
            }
            keysPressedClear() {
                this._keysPressed.length = 0;
            }
            start() {
                var d = document;
                var body = d.body;
                var inputTracker = this;
                body.onkeydown = (e) => inputTracker.keyPressed(e);
                body.onkeyup = (e) => inputTracker.keyReleased(e);
            }
        }
        TextAdventureEngine.InputTracker = InputTracker;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
