import {pointTypesOffers} from "../mock/point.js";
import Observer from "../utils/observer.js";

export default class Offers extends Observer {
  constructor() {
    super();
  }

  getOffers(type) {
    return pointTypesOffers[type];
  }
}

