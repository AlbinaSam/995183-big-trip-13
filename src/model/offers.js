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


  getOffers(type) {
    const foundType = this._pointsTypeOffers.find((item) => item.type === type.toLowerCase());
    if (foundType) {
      return foundType.offers;
    }

    return [];
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
