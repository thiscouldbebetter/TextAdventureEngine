"use strict";
var ThisCouldBeBetter;
(function (ThisCouldBeBetter) {
    var TextAdventureEngine;
    (function (TextAdventureEngine) {
        class MessageHelper {
            constructor() {
                this.vowels = ["a", "e", "i", "o", "u"];
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
