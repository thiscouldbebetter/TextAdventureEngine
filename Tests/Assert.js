
class Assert
{
	static true(booleanToCheck)
	{
		if (booleanToCheck != true)
		{
			throw new Error("Expected: true, but was: " + booleanToCheck);
		}
	}
}
