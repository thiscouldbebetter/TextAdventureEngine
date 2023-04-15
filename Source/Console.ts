
class Console
{
	textCurrent: string;
	textarea: any;
	_isReading: boolean;
	textReadSoFar: string;

	constructor(textarea: any)
	{
		this.textCurrent = "";
		this.textarea = textarea;

		this._isReading = false;
		this.textReadSoFar = null;
	}

	clear(): void
	{
		this.textCurrent = "";
		this.draw();
	}

	draw(): void
	{
		this.textarea.value = this.textCurrent;
		if (this.isReading())
		{
			this.textarea.value += "_";
		}
	}

	isReading(): boolean
	{
		return this._isReading;
	}

	readLine(): void
	{
		this._isReading = true;
		this.textReadSoFar = "";
	}

	updateForTimerTick(universe: Universe): void
	{
		if (this.isReading() )
		{
			var inputTracker = universe.inputTracker;
			var keysPressedSinceLastTick = inputTracker.keysPressed();
			for (var i = 0; i < keysPressedSinceLastTick.length; i++)
			{
				var keyPressed = keysPressedSinceLastTick[i];
				if (keyPressed.length == 1)
				{
					this.write(keyPressed);
					this.textReadSoFar += keyPressed;
				}
				else if (keyPressed == "Backspace")
				{
					if (this.textReadSoFar.length > 0)
					{
						this.textReadSoFar = this.textReadSoFar.substr(0, this.textReadSoFar.length - 1);
						this.textCurrent = this.textCurrent.substr(0, this.textCurrent.length - 1);
						this.draw();
					}
				}
				else if (keyPressed == "Enter")
				{
					this.writeLine("");
					this._isReading = false;
				}
				else
				{
					// Do nothing?
				}
			}
			inputTracker.keysPressedClear();
		}
	}

	write(textToWrite: string): void
	{
		this.textCurrent += textToWrite;
		this.draw();
	}

	writeLine(lineToWrite: string): void
	{
		if (lineToWrite != null)
		{
			this.write(lineToWrite);
		}
		this.write("\n");
	}

	writeLines(linesToWrite: string[]): void
	{
		linesToWrite.forEach(x => this.writeLine(x) );
	}
}
