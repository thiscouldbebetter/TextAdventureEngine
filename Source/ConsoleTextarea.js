"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class ConsoleTextarea {
            constructor(textarea) {
                this.textCurrent = "";
                this.textarea = textarea;
                this.lineReadPrevious = "";
                this._isReading = false;
                this._textReadSoFar = null;
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
                this.lineReadPrevious = this.textRead();
                this._isReading = true;
                this._textReadSoFar = "";
            }
            textRead() {
                return this._textReadSoFar;
            }
            textReadSoFarClear() {
                this.writeBackspaces(this._textReadSoFar.length);
            }
            updateForTimerTick(universe) {
                if (this.isReading()) {
                    var inputTracker = universe.inputTracker;
                    var keysPressedSinceLastTick = inputTracker.keysPressed();
                    for (var i = 0; i < keysPressedSinceLastTick.length; i++) {
                        var keyPressed = keysPressedSinceLastTick[i];
                        if (keyPressed.length == 1) {
                            this.write(keyPressed);
                            this._textReadSoFar += keyPressed;
                        }
                        else if (keyPressed == "Backspace") {
                            this.writeBackspaces(1);
                        }
                        else if (keyPressed == "Enter") {
                            this.writeLine("");
                            this._isReading = false;
                        }
                        else if (keyPressed == "Escape") {
                            this.textReadSoFarClear();
                        }
                        else if (keyPressed == "ArrowUp") {
                            this.textReadSoFarClear();
                            var lineReadPrevious = this.lineReadPrevious;
                            this.writeLine(lineReadPrevious);
                            this._textReadSoFar = lineReadPrevious;
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
            writeBackspaces(characterCountToBackspaceOver) {
                for (var i = 0; i < characterCountToBackspaceOver; i++) {
                    if (this._textReadSoFar.length > 0) {
                        this._textReadSoFar =
                            this._textReadSoFar
                                .substr(0, this._textReadSoFar.length - 1);
                        this.textCurrent =
                            this.textCurrent.substr(0, this.textCurrent.length - 1);
                    }
                }
                this.draw();
            }
            writeLine(lineToWrite) {
                if (lineToWrite != null) {
                    this.write(lineToWrite);
                }
                this.write("\n");
            }
            writeLineBlank() {
                this.writeLine("");
            }
            writeLinePlusBlankLine(lineToWrite) {
                this.writeLine(lineToWrite);
                this.writeLineBlank();
            }
            writeLines(linesToWrite) {
                linesToWrite.forEach(x => this.writeLine(x));
            }
        }
        TextAdventureEngine.ConsoleTextarea = ConsoleTextarea;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
