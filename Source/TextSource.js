"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class TextSourcePhraseCombination {
            constructor(phraseArrays) {
                this.phraseArrays = phraseArrays;
            }
            static fromPhraseArrays(phraseArrays) {
                return new TextSourcePhraseCombination(phraseArrays);
            }
            textDefault() {
                return this.phraseArrays.map(x => x[0] || "").join(" ").split("  ").join(" ");
            }
            textMatchesAtStart(textToCheck) {
                var phrasesForFirstPart = this.phraseArrays[0];
                var returnValue = phrasesForFirstPart.some(x => textToCheck.startsWith(x));
                return returnValue;
            }
            textMatchesExactly(textToCheck) {
                var matchesExactlySoFar = true;
                var textToCheckRemaining = textToCheck;
                for (var i = 0; i < this.phraseArrays.length; i++) {
                    var phrasesForThisPart = this.phraseArrays[i];
                    var partIsOptional = phrasesForThisPart.some(x => x == null);
                    if (partIsOptional) {
                        var phraseMatchingForThisPart = phrasesForThisPart.find(x => textToCheckRemaining.startsWith(x));
                        if (phraseMatchingForThisPart != null) {
                            textToCheckRemaining =
                                textToCheckRemaining.substr(phraseMatchingForThisPart.length + 1);
                        }
                    }
                    else {
                        var phraseMatchingForThisPart = phrasesForThisPart.find(x => textToCheckRemaining.startsWith(x));
                        if (phraseMatchingForThisPart == null) {
                            matchesExactlySoFar = false;
                            break;
                        }
                        else {
                            textToCheckRemaining =
                                textToCheckRemaining.substr(phraseMatchingForThisPart.length + 1);
                        }
                    }
                }
                return matchesExactlySoFar;
            }
            // Clonable.
            clone() {
                return new TextSourcePhraseCombination(this.phraseArrays.map(x => x.map(y => y)));
            }
        }
        TextAdventureEngine.TextSourcePhraseCombination = TextSourcePhraseCombination;
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
            textMatchesAtStart(textToCheck) {
                return this.strings.some(x => textToCheck.startsWith(x));
            }
            textMatchesExactly(textToCheck) {
                return (this.strings.indexOf(textToCheck) >= 0);
            }
            // Clonable.
            clone() {
                return TextSourceStrings.fromStrings(this.strings.map(x => x));
            }
        }
        TextAdventureEngine.TextSourceStrings = TextSourceStrings;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
