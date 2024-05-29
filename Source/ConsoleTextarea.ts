
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class ConsoleTextarea
{
	textCurrent: string;
	textarea: any;

	lineReadPrevious: string;
	_reading: boolean;
	_textReadSoFar: string;

	constructor(textarea: any)
	{
		this.textCurrent = "";
		this.textarea = textarea;

		this.lineReadPrevious = "";
		this._reading = false;
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
		if (this.reading())
		{
			this.textarea.value += "_";
		}
	}

	readLine(): void
	{
		this.lineReadPrevious = this.textRead();

		this._reading = true;
		this._textReadSoFar = "";
	}

	reading(): boolean
	{
		return this._reading;
	}

	readingStop(): void
	{
		this._reading = false;
	}

	textRead(): string
	{
		return this._textReadSoFar;
	}

	textReadSoFarClear(): void
	{
		this.writeBackspaces(this._textReadSoFar.length);
	}

	updateForTimerTick(universe: Universe): void
	{
		if (this.reading() )
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
					this.writeBackspaces(1);
				}
				else if (keyPressed == "Enter")
				{
					this.writeLine("");
					this.readingStop();
				}
				else if (keyPressed == "Escape")
				{
					this.textReadSoFarClear();
				}
				else if (keyPressed == "ArrowUp")
				{
					this.textReadSoFarClear();

					var lineReadPrevious = this.lineReadPrevious;
					this.writeLine(lineReadPrevious);
					this._textReadSoFar = lineReadPrevious;
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

	writeBackspaces(characterCountToBackspaceOver: number): void
	{
		for (var i = 0; i < characterCountToBackspaceOver; i++)
		{
			if (this._textReadSoFar.length > 0)
			{
				this._textReadSoFar =
					this._textReadSoFar
						.substr(0, this._textReadSoFar.length - 1);
				this.textCurrent =
					this.textCurrent.substr(0, this.textCurrent.length - 1);
			}
		}

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
