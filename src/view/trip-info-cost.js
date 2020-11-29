import {createElement} from "../util.js";

const createTripInfoCostTemplate = () => {
  return `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
</p>`;
};

export default class TripInfoCost {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripInfoCostTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
