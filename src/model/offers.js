import {createTypeOffersDictionary} from "../utils/offers.js";

export default class Offers {
  constructor() {
    this._pointsTypeOffers = {};
    this._pointsTypeOffersDictionary = {};
  }

  setTypeOffers(pointTypesOffers) {
    this._pointsTypeOffers = pointTypesOffers;
    this._pointsTypeOffersDictionary = createTypeOffersDictionary(this._pointsTypeOffers);
  }

  getTypes() {
    return this._pointsTypeOffers.map((item) => item.type);
  }

  getOffersDictionary() {
    if (this._pointsTypeOffersDictionary) {
      return this._pointsTypeOffersDictionary;
    }
    return {};
  }
}
