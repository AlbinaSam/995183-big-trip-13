import Observer from "../utils/observer.js";
import dayjs from "dayjs";

export default class Points extends Observer {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting task`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign({}, point,
        {
          "base_price": point.price,
          "date_from": point.startDate.toISOString(),
          "date_to": point.endDate.toISOString(),
          "is_favorite": point.isFavorite,
          "type": point.type.toLowerCase()
        });

    delete adaptedPoint.price;
    delete adaptedPoint.startDate;
    delete adaptedPoint.endDate;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

  static adaptToClient(point) {

    const adaptedPoint = Object.assign({}, point,
        {
          price: point.base_price,
          startDate: dayjs(point.date_from),
          endDate: dayjs(point.date_to),
          isFavorite: point.is_favorite
        });

    delete adaptedPoint.base_price;
    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }
}
