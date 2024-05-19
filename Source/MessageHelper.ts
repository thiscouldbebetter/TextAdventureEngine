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

	static combinePhraseArrays
	(
		phraseArrays: string[][]
	): string[]
	{
		var phrasesCombinedSoFar = phraseArrays[0].map(x => x);

		for (var i = 1; i < phraseArrays.length; i++)
		{
			var phrasesToCombine = phraseArrays[i];

			var phrasesCombinedNext = new Array<string>();

			for (var j = 0; j < phrasesCombinedSoFar.length; j++)
			{
				var phraseCombinedAlready = phrasesCombinedSoFar[j];

				for (var k = 0; k < phrasesToCombine.length; k++)
				{
					var phraseToCombine = phrasesToCombine[k];

					var phraseCombinedNew =
						phraseCombinedAlready
						+ (phraseToCombine == null ? "" : " " + phraseToCombine);

					phrasesCombinedNext.push(phraseCombinedNew);
				}
			}

			phrasesCombinedSoFar = phrasesCombinedNext;
		}

		return phrasesCombinedSoFar;
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