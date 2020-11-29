import {createElement} from "../util.js";

const createTripInfoMainTemplate = ({route, dates}) => {
  return `<div class="trip-info__main">
  <h1 class="trip-info__title">${route}</h1>

  <p class="trip-info__dates">${dates}</p>
</div>`;
};

export default class TripInfoMain {
  constructor(tripInfoMain) {
    this._element = null;
    this._infoMain = tripInfoMain;
  }

  getTemplate() {
    return createTripInfoMainTemplate(this._infoMain);
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

