"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class MessageQueue {
            constructor() {
                this.messages = [];
            }
            dequeue() {
                var message = this.messages[0];
                this.messages.splice(0, 1);
                return message;
            }
            enqueue(message) {
                this.messages.push(message);
            }
            flushToConsole(console) {
                while (this.hasMessages()) {
                    var message = this.dequeue();
                    message.consoleUpdate(console);
                }
                return this;
            }
            hasMessages() {
                return (this.messages.length > 0);
            }
        }
        TextAdventureEngine.MessageQueue = MessageQueue;
        class MessageText {
            constructor(text) {
                this.text = text;
            }
            consoleUpdate(console) {
                console.writeLinePlusBlankLine(this.text);
            }
        }
        TextAdventureEngine.MessageText = MessageText;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
