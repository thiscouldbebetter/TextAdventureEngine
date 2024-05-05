
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class StateGroup
{
	states: State[];

	constructor(states: State[])
	{
		this.states = states || new Array<State>();
	}

	stateWithNameSetToValue(stateToSetName: string, value: any): void
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
	}
 
	stateWithNameGetValue(stateToGetName: string): any
	{
		var stateFound = this.states.find(x => x.name == stateToGetName);
		var returnValue = (stateFound == null ? null : stateFound.value);
		return returnValue;
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
