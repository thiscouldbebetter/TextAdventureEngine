
class TestFixture
{
	constructor(name, tests)
	{
		this.name = name;
		this.tests = tests;
	}

	run()
	{
		this.write
		(
			"About to run fixture '" + this.name
			+ "', containing " + this.tests.length + " tests..."
		);

		var testsFailedCount = 0;

		for (var i = 0; i < this.tests.length; i++)
		{
			var test = this.tests[i];
			try
			{
				test.run();
			}
			catch (err)
			{
				this.write("Test failed: " + test.name + ".");
				testsFailedCount++;
			}
		}

		this.write
		(
			"...done running fixture '" + this.name
			+ "', containing " + this.tests.length + " tests."
		);

		this.write("Tests failed: " + testsFailedCount + "/" + this.tests.length);

	}

	write(message)
	{
		document.write(message + "<br />");
	}
}
