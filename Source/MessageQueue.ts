
namespace ThisCouldBeBetter.TextAdventureEngine
{

export interface Message
{
	consoleUpdate(console: ConsoleTextarea): void;
}

export class MessageQueue
{
	messages: Message[];

	constructor()
	{
		this.messages = [];
	}

	dequeue(): Message
	{
		var message = this.messages[0];
		this.messages.splice(0, 1);
		return message;
	}

	enqueue(message: Message): void
	{
		this.messages.push(message);
	}

	flushToConsole(console: ConsoleTextarea): MessageQueue
	{
		while (this.hasMessages() )
		{
			var message = this.dequeue();
			message.consoleUpdate(console);
		}

		return this;
	}

	hasMessages(): boolean
	{
		return (this.messages.length > 0);
	}
}

export class MessageText
{
	text: string;

	constructor(text: string)
	{
		this.text = text;
	}

	consoleUpdate(console: ConsoleTextarea): void
	{
		console.writeLinePlusBlankLine(this.text);
	}
}


}
