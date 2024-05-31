"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class TextSourceStrings {
            constructor(strings) {
                this.strings = strings || [];
            }
            static fromString(stringSingle) {
                return new TextSourceStrings([stringSingle]);
            }
            static fromStrings(strings) {
                return new TextSourceStrings(strings);
            }
            textDefault() {
                return this.strings[0];
            }
            textMatches(textToCheck) {
                return (this.strings.indexOf(textToCheck) >= 0);
            }
            textMatchesAtStart(textToCheck) {
                return this.strings.some(x => textToCheck.startsWith(x));
            }
            // Clonable.
            clone() {
                return TextSourceStrings.fromStrings(this.strings);
            }
        }
        TextAdventureEngine.TextSourceStrings = TextSourceStrings;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
