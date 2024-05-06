
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class ConsoleTextarea
{
	textCurrent: string;
	textarea: any;
	_isReading: boolean;
	_textReadSoFar: string;

	constructor(textarea: any)
	{
		this.textCurrent = "";
		this.textarea = textarea;

		this._isReading = false;
		this._textReadSoFar = null;
	}

	static default(): ConsoleTextarea
	{
		return new ConsoleTextarea(document.getElementById("textareaConsole") );
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
		this._textReadSoFar = "";
	}

	textRead(): string
	{
		return this._textReadSoFar;
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
					this._textReadSoFar += keyPressed;
				}
				else if (keyPressed == "Backspace")
				{
					if (this._textReadSoFar.length > 0)
					{
						this._textReadSoFar =
							this._textReadSoFar
								.substr(0, this._textReadSoFar.length - 1);
						this.textCurrent =
							this.textCurrent.substr(0, this.textCurrent.length - 1);
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

	writeLineBlank(): void
	{
		this.writeLine("");
	}

	writeLinePlusBlankLine(lineToWrite: string): void
	{
		this.writeLine(lineToWrite);
		this.writeLineBlank();
	}

	writeLines(linesToWrite: string[]): void
	{
		linesToWrite.forEach(x => this.writeLine(x) );
	}
}

}
