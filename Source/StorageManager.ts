
interface StorageManager2
{
	valueDeleteByKey(key: string): void;
	valueExistsForKey(key: string): boolean;
	valueGetByKey(key: string): string;
	keyAndValueSave(key: string, value: string): void;
}
