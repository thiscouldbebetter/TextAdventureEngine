
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Emplacement
{
	names: string[];
	description: string;
	_scriptUseName: string;
	stateGroup: StateGroup;
	items: Item[];
	commands: Command[];

	constructor
	(
		names: string[],
		description: string,
		scriptUseName: string,
		stateGroup: StateGroup,
		items: Item[],
		commands: Command[]
	)
	{
		this.names = names;
		this.description = description;
		this._scriptUseName = scriptUseName;
		this.stateGroup = stateGroup || new StateGroup([]);
		this.items = items || [];
		this.commands = commands || [];
	}

	static fromName(name: string): Emplacement
	{
		return Emplacement.fromNames( [ name ] );
	}

	static fromNames(names: string[]): Emplacement
	{
		var description = "You don't see anything notable.";

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
			null, null, null, null
		);
	}

	static fromNamesDescriptionAndScriptUseName
	(
		names: string[], description: string, scriptUseName: string
	): Emplacement
	{
		return new Emplacement
		(
			names,
			description,
			scriptUseName,
			null, null, null
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

	commandAddFromTextsAndScriptName(commandTexts: string[], scriptName: string): Emplacement
	{
		var command = new Command(commandTexts, scriptName);
		return this.commandAdd(command);
	}

	descriptionSet(value: string): Emplacement
	{
		this.description = value;
		return this;
	}

	itemAdd(itemToAdd: Item): Emplacement
	{
		this.items.push(itemToAdd);
		return this;
	}

	itemByName(name: string): Item
	{
		return this.items.find(x => x.namesInclude(name) );
	}

	name(): string
	{
		return this.names[0];
	}

	namesInclude(nameToMatch: string): boolean
	{
		return this.names.indexOf(nameToMatch) >= 0;
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
			this.items.map(x => x.clone() ),
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

	// Activation.

	activate(): Emplacement
	{
		this.stateGroup.stateWithNameSetToTrue("Activated");
		return this;
	}

	activated(): boolean
	{
		var stateValue = this.stateGroup.stateWithNameGetValue("Activated");
		return stateValue || false;
	}

	deactivate(): Emplacement
	{
		this.stateGroup.stateWithNameSetToFalse("Activated");
		return this;
	}

	// Locking.

	lock(): Emplacement
	{
		return this.lockedSet(true);
	}

	locked(): boolean
	{
		return this.stateWithNameIsTrue("Locked");
	}

	lockedSet(value: boolean): Emplacement
	{
		return this.stateWithNameSetToValue("Locked", value);
	}

	unlock(): Emplacement
	{
		return this.lockedSet(false);
	}

	// Visibility.

	hide(): Emplacement
	{
		return this.visibleSet(false);
	}

	show(): Emplacement
	{
		return this.visibleSet(true);
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
