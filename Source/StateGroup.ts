
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class StateGroup
{
	states: State[];

	constructor(states: State[])
	{
		this.states = states || new Array<State>();
	}

	static create(): StateGroup
	{
		return new StateGroup(null);
	}

	stateWithNameSetToFalse(stateToSetName: string): StateGroup
	{
		return this.stateWithNameSetToValue(stateToSetName, false);
	}

	stateWithNameSetToTrue(stateToSetName: string): StateGroup
	{
		return this.stateWithNameSetToValue(stateToSetName, true);
	}

	stateWithNameSetToValue(stateToSetName: string, value: any): StateGroup
	{
		var stateFound = this.states.find(x => x.name == stateToSetName);
		if (stateFound == null)
		{
			stateFound = new State(stateToSetName, value);
			this.states.push(stateFound);
		}
		else
		{
			stateFound.value = value;
		}

		return this;
	}
 
	stateWithNameGetValue(stateToGetName: string): any
	{
		var stateFound = this.states.find(x => x.name == stateToGetName);
		var returnValue = (stateFound == null ? null : stateFound.value);
		return returnValue;
	}

	stateWithNameIsTrue(stateToGetName: string): boolean
	{
		return (this.stateWithNameGetValue(stateToGetName) == true);
	}

	// Clonable.

	clone()
	{
		return new StateGroup(this.states.map(x => x.clone()) );
	}

	// Serialization.

	static prototypesSet(instanceAsObject: any): void
	{
		Object.setPrototypeOf(instanceAsObject, StateGroup.prototype);
		instanceAsObject.states.forEach( (x: any) => State.prototypesSet(x) );
	}

}

}
