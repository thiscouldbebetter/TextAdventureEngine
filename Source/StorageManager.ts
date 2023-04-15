
class StorageManager2
{
	_valuesByKey: Map<string, string>;

	constructor()
	{
		// todo - Use local storage.
		this._valuesByKey = new Map<string, string>();
	}

	deleteByKey(key: string): void
	{
		this._valuesByKey.delete(key);
	}

	getValueByKey(key: string): string
	{
		return this._valuesByKey.get(key);
	}

	saveKeyWithValue(key: string, value: string): void
	{
		this._valuesByKey.set(key, value);
	}
}
