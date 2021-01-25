import PointsModel from "../model/points.js";
import {storeKey} from "../const.js";

const createStoreStructure = (itemsType, items) => {
  return items.reduce((acc, current) => {
    switch (itemsType) {
      case storeKey.POINTS_STORE_KEY:
        return Object.assign({}, acc, {
          [current.id]: current,
        });

      case storeKey.OFFERS_STORE_KEY:
        return Object.assign({}, acc, {
          [current.type]: current,
        });

      case storeKey.DESTINATIONS_STORE_KEY:
        return Object.assign({}, acc, {
          [current.name]: current,
        });

      default:
        return {};
    }
  }, {});
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
  .map(({payload}) => payload.point);
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._needSync = false;
  }

  getSyncNeed() {
    return this._needSync;
  }

  getPoints() {
    if (this._isOnline()) {
      return this._api.getPoints()
      .then((points) => {
        const pointsForStore = createStoreStructure(storeKey.POINTS_STORE_KEY, points.map(PointsModel.adaptToServer));
        this._store.setItems(storeKey.POINTS_STORE_KEY, pointsForStore);
        return points;
      });
    }

    const storePoints = Object.values(this._store.getItems(storeKey.POINTS_STORE_KEY));

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  getOffers() {
    if (this._isOnline()) {
      this._api.getOffers()
      .then((offers) => {

        const offersToStore = createStoreStructure(storeKey.OFFERS_STORE_KEY, offers);
        this._store.setItems(storeKey.OFFERS_STORE_KEY, offersToStore);
        return offers;
      });
    }

    const storeOffers = Object.values(this._store.getItems(storeKey.OFFERS_STORE_KEY));

    return Promise.resolve(storeOffers);
  }

  getDestinations() {
    if (this._isOnline()) {
      this._api.getDestinations()
      .then((destinations) => {
        const destinationsToStore = createStoreStructure(storeKey.DESTINATIONS_STORE_KEY, destinations);
        this._store.setItems(storeKey.DESTINATIONS_STORE_KEY, destinationsToStore);
        return destinations;
      });
    }

    const storeDestinations = Object.values(this._store.getItems(storeKey.DESTINATIONS_STORE_KEY));

    return Promise.resolve(storeDestinations);
  }

  updatePoint(point) {
    if (this._isOnline()) {
      return this._api.updatePoint(point)
      .then((updatedPoint) => {
        this._store.setPointItem(storeKey.POINTS_STORE_KEY, updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
        return updatedPoint;
      });
    }

    this._store.setPointItem(storeKey.POINTS_STORE_KEY, point.id, PointsModel.adaptToServer(Object.assign({}, point)));
    this._needSync = true;

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (this._isOnline()) {
      return this._api.addPoint(point)
      .then((newPoint) => {
        this._store.setPointItem(storeKey.POINTS_STORE_KEY, newPoint.id, PointsModel.adaptToServer(newPoint));
        return newPoint;
      });
    }

    return Promise.reject(new Error(`Add point failed`));
  }

  deletePoint(point) {

    if (this._isOnline()) {
      return this._api.deletePoint(point)
      .then(() => this._store.removePointItem(storeKey.POINTS_STORE_KEY, point.id));
    }

    return Promise.reject(new Error(`Delete point failed`));
  }

  sync() {
    if (this._isOnline()) {
      const storePoints = Object.values(this._store.getItems(storeKey.POINTS_STORE_KEY));
      return this._api.sync(storePoints)
      .then((response) => {
        const createdPoints = getSyncedPoints(response.created);
        const updatedPoints = getSyncedPoints(response.updated);

        const items = createStoreStructure(storeKey.POINTS_STORE_KEY, [...createdPoints, ...updatedPoints]);

        this._store.setItems(storeKey.POINTS_STORE_KEY, items);
        this._needSync = false;
      });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  _isOnline() {
    return window.navigator.onLine;
  }

}
