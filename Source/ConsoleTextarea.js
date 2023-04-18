"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class ConsoleTextarea {
            constructor(textarea) {
                this.textCurrent = "";
                this.textarea = textarea;
                this._isReading = false;
                this.textReadSoFar = null;
            }
            static default() {
                return new ConsoleTextarea(document.getElementById("textareaConsole"));
            }
            clear() {
                this.textCurrent = "";
                this.draw();
            }
            draw() {
                this.textarea.value = this.textCurrent;
                if (this.isReading()) {
                    this.textarea.value += "_";
                }
            }
            isReading() {
                return this._isReading;
            }
            readLine() {
                this._isReading = true;
                this.textReadSoFar = "";
            }
            updateForTimerTick(universe) {
                if (this.isReading()) {
                    var inputTracker = universe.inputTracker;
                    var keysPressedSinceLastTick = inputTracker.keysPressed();
                    for (var i = 0; i < keysPressedSinceLastTick.length; i++) {
                        var keyPressed = keysPressedSinceLastTick[i];
                        if (keyPressed.length == 1) {
                            this.write(keyPressed);
                            this.textReadSoFar += keyPressed;
                        }
                        else if (keyPressed == "Backspace") {
                            if (this.textReadSoFar.length > 0) {
                                this.textReadSoFar = this.textReadSoFar.substr(0, this.textReadSoFar.length - 1);
                                this.textCurrent = this.textCurrent.substr(0, this.textCurrent.length - 1);
                                this.draw();
                            }
                        }
                        else if (keyPressed == "Enter") {
                            this.writeLine("");
                            this._isReading = false;
                        }
                        else {
                            // Do nothing?
                        }
                    }
                    inputTracker.keysPressedClear();
                }
            }
            write(textToWrite) {
                this.textCurrent += textToWrite;
                this.draw();
            }
            writeLine(lineToWrite) {
                if (lineToWrite != null) {
                    this.write(lineToWrite);
                }
                this.write("\n");
            }
            writeLines(linesToWrite) {
                linesToWrite.forEach(x => this.writeLine(x));
            }
        }
        TextAdventureEngine.ConsoleTextarea = ConsoleTextarea;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
