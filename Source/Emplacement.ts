
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Emplacement
{
	names: string[];
	description: string;
	_scriptUseName: string;
	stateGroup: StateGroup;
	commands: Command[];

	constructor
	(
		names: string[],
		description: string,
		scriptUseName: string,
		stateGroup: StateGroup,
		commands: Command[]
	)
	{
		this.names = names;
		this.description = description;
		this._scriptUseName = scriptUseName;
		this.stateGroup = stateGroup || new StateGroup([]);
		this.commands = commands || [];
	}

	static fromName(name: string): Emplacement
	{
		return Emplacement.fromNames( [ name ] );
	}

	static fromNames(names: string[]): Emplacement
	{
		var description = "This is just a " + names[0] + ".";

		return Emplacement.fromNamesAndDescription
		(
			names,
			description
		);
	}

	static fromNamesAndDescription(names: string[], description: string): Emplacement
	{
		return new Emplacement
		(
			names,
			description,
			null, null, null
		);
	}

	static fromNameDescriptionAndScriptUse
	(
		name: string, description: string, scriptUse: Script
	): Emplacement
	{
		return new Emplacement
		(
			[ name ],
			description,
			scriptUse.name,
			null, null
		);
	}

	static fromNameDescriptionAndScriptUseName
	(
		name: string, description: string, scriptUseName: string
	): Emplacement
	{
		return new Emplacement
		(
			[ name ],
			description,
			scriptUseName,
			null, null
		);
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

	name(): string
	{
		return this.names[0];
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
			this.names.map(x => x),
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

	// States.

	stateWithNameGetValue(stateToGetName: string): any
	{
		return this.stateGroup.stateWithNameGetValue(stateToGetName);
	}

	stateWithNameIsTrue(stateName: string): boolean
	{
		return (this.stateWithNameGetValue(stateName) == true);
	}

	stateWithNameSetToTrue(stateToSetName: string): Emplacement
	{
		return this.stateWithNameSetToValue(stateToSetName, true);
	}

	stateWithNameSetToValue(stateToSetName: string, valueToSet: any): Emplacement
	{
		this.stateGroup.stateWithNameSetToValue(stateToSetName, valueToSet);
		return this;
	}

	visible(): boolean
	{
		return this.stateWithNameIsTrue("Visible");
	}

	visibleSet(value: boolean): Emplacement
	{
		return this.stateWithNameSetToValue("Visible", value);
	}
}

}
