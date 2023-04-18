
class TestSuite
{
	constructor(fixtures)
	{
		this.fixtures = fixtures;
	}

	run()
	{
		this.fixtures.forEach(x => x.run() );
	}
}
