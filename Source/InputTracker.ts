
class InputTracker
{
	_keysPressed: string[];

	constructor()
	{
		this._keysPressed = [];
	}

	keyPressed(event: any): void
	{
		var key = event.key;
		if (this._keysPressed.indexOf(key) < 0)
		{
			this._keysPressed.push(key);
		}
	}

	keyReleased(event: any): void
	{
		var key = event.key;
		if (this._keysPressed.indexOf(key) >= 0)
		{
			this._keysPressed.splice(this._keysPressed.indexOf(key), 1);
		}
	}

	keysPressed(): string[]
	{
		return this._keysPressed;
	}

	keysPressedClear(): void
	{
		this._keysPressed.length = 0;
	}

	start(): void
	{
		var d = document;
		var body = d.body;
		var inputTracker = this;
		body.onkeydown = (e) => inputTracker.keyPressed(e);
		body.onkeyup = (e) => inputTracker.keyReleased(e);
	}
}
