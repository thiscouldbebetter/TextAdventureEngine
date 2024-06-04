
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class Emplacement
{
	names: string[];
	descriptionAsPartOfPlace: string;
	descriptionWhenExamined: string;
	_scriptUse: Script;
	stateGroup: StateGroup;
	items: Item[];
	commands: Command[];

	constructor
	(
		names: string[],
		descriptionAsPartOfPlace: string,
		descriptionWhenExamined: string,
		scriptUse: Script,
		stateGroup: StateGroup,
		items: Item[],
		commands: Command[]
	)
	{
		this.names = names;
		this.descriptionAsPartOfPlace = descriptionAsPartOfPlace;
		this.descriptionWhenExamined = descriptionWhenExamined;
		this._scriptUse = scriptUse;
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
		return Emplacement.fromNamesAndDescriptions
		(
			names,
			null, // descriptionAsPartOfPlace
			null // descriptionWhenExamined
		);
	}

	static fromNamesAndDescriptions
	(
		names: string[],
		descriptionAsPartOfPlace: string,
		descriptionWhenExamined: string
	): Emplacement
	{
		return new Emplacement
		(
			names,
			descriptionAsPartOfPlace,
			descriptionWhenExamined,
			null, null, null, null
		);
	}

	static fromNamesDescriptionsAndScriptUseName
	(
		names: string[],
		descriptionAsPartOfPlace: string,
		descriptionWhenExamined: string,
		scriptUseName: string
	): Emplacement
	{
		return new Emplacement
		(
			names,
			descriptionAsPartOfPlace,
			descriptionWhenExamined,
			Script.fromName(scriptUseName),
			null, null, null
		);
	}

	canBeUsed(): boolean
	{
		return (this._scriptUse != null);
	}

	commandAdd(command: Command): Emplacement
	{
		this.commands.push(command);
		return this;
	}

	commandAddFromTextSourceAndScriptName
	(
		textSource: TextSource, scriptName: string
	): Emplacement
	{
		var command = Command.fromTextSourceAndScriptExecuteName(textSource, scriptName);
		return this.commandAdd(command);
	}

	commandAddFromTextsAndScriptName
	(
		commandTexts: string[], scriptName: string
	): Emplacement
	{
		var command = Command.fromTextsAndScriptExecuteName(commandTexts, scriptName);
		return this.commandAdd(command);
	}

	commandWithTextRemove(commandText: string): Emplacement
	{
		var commandToRemove =
			this.commands.find(x => x.textsInclude(commandText) );
		if (commandToRemove != null)
		{
			this.commands.splice(this.commands.indexOf(commandToRemove), 1);
		}

		return this;
	}

	descriptionAsPartOfPlaceSet(value: string): Emplacement
	{
		this.descriptionAsPartOfPlace = value;
		return this;
	}

	descriptionWhenExaminedSet(value: string): Emplacement
	{
		this.descriptionWhenExamined = value;
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

	scriptUse(): Script
	{
		return this._scriptUse;
	}

	use(universe: Universe, world: World, place: Place, target: any): void
	{
		var scriptUse = this.scriptUse();
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
			this.descriptionAsPartOfPlace,
			this.descriptionWhenExamined,
			this._scriptUse.clone(),
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
