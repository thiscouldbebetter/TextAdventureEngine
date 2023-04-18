
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class MessageQueue
{
	messages: string[];

	constructor()
	{
		this.messages = [];
	}

	dequeue(): string
	{
		var message = this.messages[0];
		this.messages.splice(0, 1);
		return message;
	}

	enqueue(message: string): void
	{
		this.messages.push(message);
	}

	hasMessages(): boolean
	{
		return (this.messages.length > 0);
	}
}

}
