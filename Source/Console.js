
class Console
{
	constructor(textarea)
	{
		this.textarea = textarea;

		this.textReadSoFar = null;
		this.callbackForReadLine = null;
	}

	backspace()
	{
		var textBefore = this.textarea.value;
		this.textarea.value = textBefore.substr(0, textBefore.length - 1);
	}

	clear()
	{
		this.textarea.value = "";
	}

	readLine(callback)
	{
		this.textReadSoFar = "";
		this.callbackForReadLine = callback;
	}

	write(textToWrite)
	{
		this.textarea.value += textToWrite;

		if (this.textReadSoFar != null)
		{
			if (textToWrite == "\n")
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
