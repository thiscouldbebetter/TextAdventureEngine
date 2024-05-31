
namespace ThisCouldBeBetter.TextAdventureEngine
{

export interface TextSource
{
	clone(): TextSource;
	textDefault(): string;
	textMatchesAtStart(textToCheck: string): boolean;
	textMatchesExactly(textToCheck: string): boolean;
}

export class TextSourcePhraseCombination implements TextSource
{
	phraseArrays: string[][];

	constructor(phraseArrays: string[][])
	{
		this.phraseArrays = phraseArrays;
	}

	static fromPhraseArrays(phraseArrays: string[][]): TextSourcePhraseCombination
	{
		return new TextSourcePhraseCombination( phraseArrays );
	}

	textDefault(): string
	{
		return this.phraseArrays.map(x => x[0] || "").join(" ").split("  ").join(" ");
	}

	textMatchesAtStart(textToCheck: string): boolean
	{
		var phrasesForFirstPart = this.phraseArrays[0];
		var returnValue =
			phrasesForFirstPart.some(x => textToCheck.startsWith(x) );
		return returnValue;
	}

	textMatchesExactly(textToCheck: string): boolean
	{
		var matchesExactlySoFar = true;

		var textToCheckRemaining = textToCheck;

		for (var i = 0; i < this.phraseArrays.length; i++)
		{
			var phrasesForThisPart = this.phraseArrays[i];
			var partIsOptional = phrasesForThisPart.some(x => x == null);
			if (partIsOptional)
			{
				var phraseMatchingForThisPart =
					phrasesForThisPart.find
					(
						x => textToCheckRemaining.startsWith(x)
					);

				if (phraseMatchingForThisPart != null)
				{
					textToCheckRemaining =
						textToCheckRemaining.substr(phraseMatchingForThisPart.length + 1);
				}
			}
			else
			{
				var phraseMatchingForThisPart =
					phrasesForThisPart.find
					(
						x => textToCheckRemaining.startsWith(x)
					);

				if (phraseMatchingForThisPart == null)
				{
					matchesExactlySoFar = false;
					break;
				}
				else
				{
					textToCheckRemaining =
						textToCheckRemaining.substr(phraseMatchingForThisPart.length + 1);
				}
			}
		}

		return matchesExactlySoFar;
	}

	// Clonable.

	clone(): TextSource
	{
		return new TextSourcePhraseCombination(this.phraseArrays.map(x => x.map(y => y) ) );
	}
}

export class TextSourceStrings implements TextSource
{
	strings: string[];

	constructor(strings: string[])
	{
		this.strings = strings || [];
	}

	static fromString(stringSingle: string): TextSourceStrings
	{
		return new TextSourceStrings( [ stringSingle ] );
	}

	static fromStrings(strings: string[]): TextSourceStrings
	{
		return new TextSourceStrings( strings );
	}

	textDefault(): string
	{
		return this.strings[0];
	}

	textMatchesAtStart(textToCheck: string): boolean
	{
		return this.strings.some(x => textToCheck.startsWith(x) );
	}

	textMatchesExactly(textToCheck: string): boolean
	{
		return (this.strings.indexOf(textToCheck) >= 0);
	}

	// Clonable.

	clone(): TextSource
	{
		return TextSourceStrings.fromStrings(this.strings.map(x => x) );
	}
}

}