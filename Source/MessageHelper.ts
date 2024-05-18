namespace ThisCouldBeBetter.TextAdventureEngine
{

export class MessageHelper
{
	static Instance = new MessageHelper();

	vowels: string[];

	constructor()
	{
		this.vowels = [ "a", "e", "i", "o", "u" ];
	}

	static combineStringArrays
	(
		stringsStart: string[],
		stringsEnd: string[]
	): string[]
	{
		var stringsCombined = new Array<string>();

		for (var i = 0; i < stringsStart.length; i++)
		{
			var stringStart = stringsStart[i];

			for (var j = 0; j < stringsEnd.length; j++)
			{
				var stringEnd = stringsEnd[j];

				var stringCombined = stringStart + " " + stringEnd;

				stringsCombined.push(stringCombined);
			}
		}

		return stringsCombined;
	}

	wordPrefixedWithAOrAn(word: string): string
	{
		var wordStartsWithVowel =
			this.vowels.indexOf(word[0].toLowerCase() ) >= 0;

		var returnValue =
			"a"
			+ (wordStartsWithVowel ? "n" : "")
			+ " "
			+ word;

		return returnValue;
	}
}

}