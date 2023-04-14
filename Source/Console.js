
class Console
{
	constructor(textarea)
	{
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

			var textBefore = this.textarea.value;
			this.textarea.value = textBefore.substr(0, textBefore.length - 1);
		}
	}

	clear()
	{
		this.textarea.value = "";
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
		if (this.textReadSoFar != null)
		{
			// Remove the cursor.
			var textareaValue = this.textarea.value;
			this.textarea.value = textareaValue.substr(0, textareaValue.length -1);
		}

		this.textarea.value += textToWrite;

		if (this.textReadSoFar != null)
		{
			// Add the cursor.
			var textareaValue = this.textarea.value;
			this.textarea.value += "_";
		}

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
