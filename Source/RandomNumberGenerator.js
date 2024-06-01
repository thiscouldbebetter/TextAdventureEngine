"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class RandomNumberGenerator {
            constructor() {
                this._numbersQueue = new Array();
            }
            dequeue() {
                var returnValue;
                if (this._numbersQueue.length == 0) {
                    returnValue = Math.random();
                }
                else {
                    returnValue = this._numbersQueue[0];
                    this._numbersQueue.splice(0, 1);
                }
                return returnValue;
            }
            enqueue(value) {
                this._numbersQueue.splice(0, 0, value);
                return this;
            }
            next() {
                return this.dequeue();
            }
            randomElementFromArray(arrayToGetElementFrom) {
                var randomNumber = this.next();
                var randomIndex = Math.floor(randomNumber * arrayToGetElementFrom.length);
                var randomElement = arrayToGetElementFrom[randomIndex];
                return randomElement;
            }
        }
        TextAdventureEngine.RandomNumberGenerator = RandomNumberGenerator;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
