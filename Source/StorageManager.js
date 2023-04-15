
class StorageManager
{
	constructor()
	{
		// todo - Use local storage.
		this._valuesByKey = new Map();
	}

	deleteByKey(key)
	{
		this._valuesByKey.delete(key);
	}

	getValueByKey(key)
	{
		return this._valuesByKey.get(key);
	}

	saveKeyWithValue(key, value)
	{
		this._valuesByKey.set(key, value);
	}
}