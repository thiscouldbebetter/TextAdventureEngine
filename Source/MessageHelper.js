"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class MessageHelper {
            constructor() {
                this.vowels = ["a", "e", "i", "o", "u"];
            }
            static combineStringArrays(stringsStart, stringsEnd) {
                var stringsCombined = new Array();
                for (var i = 0; i < stringsStart.length; i++) {
                    var stringStart = stringsStart[i];
                    for (var j = 0; j < stringsEnd.length; j++) {
                        var stringEnd = stringsEnd[j];
                        var stringCombined = stringStart + " " + stringEnd;
                        stringsCombined.push(stringCombined);
                    }
                }
                return stringsCombined;
            }
            wordPrefixedWithAOrAn(word) {
                var wordStartsWithVowel = this.vowels.indexOf(word[0].toLowerCase()) >= 0;
                var returnValue = "a"
                    + (wordStartsWithVowel ? "n" : "")
                    + " "
                    + word;
                return returnValue;
            }
        }
        MessageHelper.Instance = new MessageHelper();
        TextAdventureEngine.MessageHelper = MessageHelper;
    })(TextAdventureEngine = ThisCouldBeBetter.TextAdventureEngine || (ThisCouldBeBetter.TextAdventureEngine = {}));
})(ThisCouldBeBetter || (ThisCouldBeBetter = {}));
