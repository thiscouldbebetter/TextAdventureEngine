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