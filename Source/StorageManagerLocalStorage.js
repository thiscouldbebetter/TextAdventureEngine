"use strict";
class StorageManagerLocalStorage {
    constructor(keyPrefix) {
        this.keyPrefix = keyPrefix;
        this._localStorage = localStorage;
    }
    clearAll() {
        this._localStorage.clearAll();
    }
    valueDeleteByKey(key) {
        var keyWithPrefix = this.keyPrefix + key;
        this._localStorage.removeItem(keyWithPrefix);
    }
    valueExistsForKey(key) {
        return (this._localStorage.getItem(key) != null);
    }
    valueGetByKey(key) {
        return this._localStorage.getItem(key);
    }
    keyAndValueSave(key, value) {
        this._localStorage.setItem(key, value);
    }
}
