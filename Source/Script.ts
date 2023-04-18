
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Script
{
	name: string;
	run: any;

	constructor(name: string, run: any)
	{
		this.name = name;
		this.run = run;
	}

	// Clonable.

	clone(): Script
	{
		return new Script
		(
			this.name,
			this.run // todo
		);
	}
}

}
