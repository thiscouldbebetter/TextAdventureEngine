
namespace ThisCouldBeBetter.TextAdventureEngine
{

export interface TextSource
{
	clone(): TextSource;
	textDefault(): string;
	textMatches(textToCheck: string): boolean;
	textMatchesAtStart(textToCheck: string): boolean;
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

	textMatches(textToCheck: string): boolean
	{
		return (this.strings.indexOf(textToCheck) >= 0);
	}

	textMatchesAtStart(textToCheck: string): boolean
	{
		return this.strings.some(x => textToCheck.startsWith(x) );
	}

	// Clonable.

	clone(): TextSource
	{
		return TextSourceStrings.fromStrings(this.strings);
	}
}

}