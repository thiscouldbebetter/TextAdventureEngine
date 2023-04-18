
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class StorageManagerMemory implements StorageManager2
{
	_valuesByKey: Map<string, string>;

	constructor()
	{
		this._valuesByKey = new Map<string, string>();
	}

	clearAll()
	{
		this._valuesByKey.clear();
	}

	valueDeleteByKey(key: string): void
	{
		this._valuesByKey.delete(key);
	}

	valueExistsForKey(key: string): boolean
	{
		return this._valuesByKey.has(key);
	}

	valueGetByKey(key: string): string
	{
		return this._valuesByKey.get(key);
	}

	keyAndValueSave(key: string, value: string): void
	{
		this._valuesByKey.set(key, value);
	}
}

}
