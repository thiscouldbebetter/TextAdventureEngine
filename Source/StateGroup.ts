
class StateGroup
{
	constructor(states)
	{
		this.states = states || [];
	}

	stateWithNameSetToValue(stateToSetName, value)
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
 
	valueGetByName(stateToGetName, states)
	{
		var stateFound = this.states.find(x => x.name == stateToGetName);
		var returnValue = (stateFound == null ? null : stateFound.value);
		return returnValue;
	}

}
