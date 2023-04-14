
class UiEventHandler
{
	constructor(universe)
	{
		this.universe = universe;
	}

	body_KeyDown(event)
	{
		event.preventDefault();

		var keyPressedAsText = event.key;
		if (keyPressedAsText.length == 1)
		{
			this.universe.console.write(keyPressedAsText);
		}
		else if (keyPressedAsText == "Backspace")
		{
			// todo
			this.universe.console.backspace();
		}
		else if (keyPressedAsText == "Enter")
		{
			this.universe.console.write("\n");
		}
	}

	initialize()
	{
		var d = document;
		var body = d.body;
		body.onkeydown = this.body_KeyDown.bind(this);
	}
}
