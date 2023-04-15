
class Console
{
	constructor(textarea)
	{
		this.textCurrent = "";
		this.textarea = textarea;

		this.textReadSoFar = null;
		this.callbackForReadCharacter = null;
		this.callbackForReadLine = null;
	}

	backspace()
	{
		if (this.textReadSoFar != null && this.textReadSoFar.length > 0)
		{
			this.textReadSoFar =
				this.textReadSoFar.substr(0, this.textReadSoFar.length - 1);

			var textBefore = this.textCurrent;
			this.textCurrent = textBefore.substr(0, textBefore.length - 1);
		}

		this.draw();
	}

	clear()
	{
		this.textCurrent = "";
		this.draw();
	}

	draw()
	{
		this.textarea.value = this.textCurrent;
		if (this.isReading())
		{
			this.textarea.value += "_"
		}
	}

	isReading()
	{
		var returnValue =
		(
			this.callbackForReadCharacter != null
			|| this.callbackForReadLine != null
		);
		return returnValue;
	}

	readCharacter(callback)
	{
		this.textReadSoFar = "";
		this.callbackForReadCharacter = callback;
		this.write("");
	}

	readLine(callback)
	{
		this.textReadSoFar = "";
		this.callbackForReadLine = callback;
		this.write("");
	}

	write(textToWrite)
	{
		this.textCurrent += textToWrite;

		if (this.textReadSoFar != null)
		{
			if (this.callbackForReadCharacter != null)
			{
				var callback = this.callbackForReadCharacter;

				this.callbackForReadCharacter = null;

				callback(textToWrite);
			}
			else if (textToWrite == "\n")
			{
				var callback = this.callbackForReadLine;
				var textReadSoFar = this.textReadSoFar;

				this.callbackForReadLine = null;
				this.textReadSoFar = null;

				callback(textReadSoFar);
			}
			else
			{
				this.textReadSoFar += textToWrite;
			}
		}
		this.draw();
	}

	writeLine(lineToWrite)
	{
		if (lineToWrite != null)
		{
			this.write(lineToWrite);
		}
		this.write("\n");
	}

	writeLines(linesToWrite)
	{
		linesToWrite.forEach(x => this.writeLine(x) );
	}
}
