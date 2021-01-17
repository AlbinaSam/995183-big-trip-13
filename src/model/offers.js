export default class Offers {
  constructor() {
    this._pointsTypeOffers = {};
  }

  setTypeOffers(pointTypesOffers) {
    this._pointsTypeOffers = pointTypesOffers;
  }

  getOffers(type) {
    const foundType = this._pointsTypeOffers.find((item) => item.type === type.toLowerCase());
    return foundType.offers;
  }

  getTypes() {
    return this._pointsTypeOffers.map((item) => item.type);
  }
}

