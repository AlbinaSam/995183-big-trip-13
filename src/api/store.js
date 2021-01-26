export default class Store {
  constructor(key1, key2, key3, storage) {
    this._storage = storage;
    this._storeKeys = Object.assign({}, key1, key2, key3);
  }

  getItems(storeKey) {
    try {
      return JSON.parse(this._storage.getItem(this._storeKeys[storeKey])) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(storeKey, items) {
    this._storage.setItem(
        this._storeKeys[storeKey],
        JSON.stringify(items)
    );
  }

  setPointItem(storeKey, pointKey, value) {
    const pointsStore = this.getItems(storeKey);

    this._storage.setItem(
        this._storeKeys[storeKey],
        JSON.stringify(
            Object.assign({}, pointsStore, {
              [pointKey]: value
            })
        )
    );

  }

  removePointItem(storeKey, pointKey) {
    const store = this.getItems(storeKey);
    delete store[pointKey];
    this._storage.setItem(
        this._storeKeys[storeKey],
        JSON.stringify(store)
    );
  }
}
