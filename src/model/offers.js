export default class Offers {
  constructor() {
    this._pointsTypeOffers = {};
  }

  setTypeOffers(pointTypesOffers) {
    this._pointsTypeOffers = pointTypesOffers;
  }

  getOffers(type) {
    return this._pointsTypeOffers[type];
  }
}

