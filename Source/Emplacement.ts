
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Emplacement
{
	name: string;
	description: string;
	_scriptUseName: string;
	stateGroup: StateGroup;
	commands: Command[];

	constructor
	(
		name: string,
		description: string,
		scriptUseName: string,
		stateGroup: StateGroup,
		commands: Command[]
	)
	{
		this.name = name;
		this.description = description;
		this._scriptUseName = scriptUseName;
		this.stateGroup = stateGroup || new StateGroup([]);
		this.commands = commands || [];
	}

	static fromNameAndDescription(name: string, description: string): Emplacement
	{
		return new Emplacement(name, description, null, null, null);
	}

	static fromNameDescriptionAndScriptUse
	(
		name: string, description: string, scriptUse: Script
	): Emplacement
	{
		return new Emplacement(name, description, scriptUse.name, null, null);
	}

	static fromNameDescriptionAndScriptUseName
	(
		name: string, description: string, scriptUseName: string
	): Emplacement
	{
		return new Emplacement(name, description, scriptUseName, null, null);
	}

	canBeUsed(): boolean
	{
		return (this._scriptUseName != null);
	}

	commandAdd(command: Command): Emplacement
	{
		this.commands.push(command);
		return this;
	}

	scriptUse(world: World): Script
	{
		return world.scriptByName(this._scriptUseName);
	}

	use(universe: Universe, world: World, place: Place, target: any): void
	{
		var scriptUse = this.scriptUse(world);
		if (scriptUse != null)
		{
			scriptUse.run(universe, world, place, this, target);
		}
	}

	// Clone.

	clone(): Emplacement
	{
		return new Emplacement
		(
			this.name,
			this.description,
			this._scriptUseName,
			this.stateGroup.clone(),
			this.commands.map(x => x.clone() )
		);
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, Emplacement.prototype);
		StateGroup.prototypesSet(instanceAsObject.stateGroup);
		instanceAsObject.commands.forEach( (x: any) => Command.prototypesSet(x) );
	}
}

}
