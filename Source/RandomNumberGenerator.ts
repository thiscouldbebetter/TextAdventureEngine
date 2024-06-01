namespace ThisCouldBeBetter.TextAdventureEngine
{

export class RandomNumberGenerator
{
	_numbersQueue: number[];

	constructor()
	{
		this._numbersQueue = new Array<number>();
	}

	dequeue(): number
	{
		var returnValue: number;

		if (this._numbersQueue.length == 0)
		{
			returnValue = Math.random();
		}
		else
		{
			returnValue = this._numbersQueue[0];
			this._numbersQueue.splice(0, 1);
		}

		return returnValue;
	}

	enqueue(value: number): RandomNumberGenerator
	{
		this._numbersQueue.splice(0, 0, value);
		return this;
	}

	next(): number
	{
		return this.dequeue();
	}

	randomElementFromArray(arrayToGetElementFrom: any[]): any
	{
		var randomNumber = this.next();
		var randomIndex = Math.floor(randomNumber * arrayToGetElementFrom.length);
		var randomElement = arrayToGetElementFrom[randomIndex];
		return randomElement;
	}
}

}