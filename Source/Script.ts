
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Script
{
	name: string;
	_run: (u: Universe, w: World, p: Place, x: any, y: any) => void;

	constructor(name: string, run: any)
	{
		this.name = name;
		this._run = run;
	}

	static fromName(name: string): Script
	{
		return new Script(name, null);
	}

	static fromNameAndRun
	(
		name: string,
		run: (u: Universe, w: World, p: Place, x:any, y: any) => void
	): Script
	{
		return new Script(name, run);
	}

	run(u: Universe, w: World, p: Place, x: any, y: any): void
	{
		var run = this._run || w.scriptByName(this.name)._run;
		run(u, w, p, x, y);
	}

	// Clonable.

	clone(): Script
	{
		return new Script
		(
			this.name,
			this._run // todo
		);
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, Script.prototype);
		// todo - run?
	}

}

}
