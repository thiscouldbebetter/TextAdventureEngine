
namespace ThisCouldBeBetter.TextAdventureEngine
{

export class StorageManagerLocalStorage implements StorageManager2
{
	keyPrefix: string;

	_localStorage: any;

	constructor(keyPrefix: string)
	{
		this.keyPrefix = keyPrefix;

		this._localStorage = localStorage;
	}

	clearAll()
	{
		this._localStorage.clearAll();
	}

	valueDeleteByKey(key: string): void
	{
		var keyWithPrefix = this.keyPrefix + key;
		this._localStorage.removeItem(keyWithPrefix);
	}

	valueExistsForKey(key: string): boolean
	{
		return (this._localStorage.getItem(key) != null);
	}

	valueGetByKey(key: string): string
	{
		return this._localStorage.getItem(key);
	}

	keyAndValueSave(key: string, value: string): void
	{
		this._localStorage.setItem(key, value);
	}
}

}
