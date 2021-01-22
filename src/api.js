import PointsModel from "./model/points.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
    .then(Api.toJson)
    .then((points) => points.map((point) => PointsModel.adaptToClient(point)));
  }

  getOffers() {
    return this._load({url: `offers`})
    .then(Api.toJson);
  }

  getDestinations() {
    return this._load({url: `destinations`})
    .then(Api.toJson);
  }

  updatePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({"Content-Type": `application/json`})})
    .then(Api.toJson)
    .then(PointsModel.adaptToClient);
  }

  addPoint(point) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJson)
      .then(PointsModel.adaptToClient);
  }

  deletePoint(point) {
    return this._load({
      url: `points/${point.id}`,
      method: Method.DELETE
    });
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
    .then(Api.checkStatus);
  }

  static checkStatus(response) {
    if (response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJson(response) {
    return response.json();
  }
}
