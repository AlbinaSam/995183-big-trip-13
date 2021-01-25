import AbstractView from "./abstract.js";

const createTripInfoMainTemplate = ({route, dates}) => {

  return `<div class="trip-info__main">
  <h1 class="trip-info__title">${route}</h1>

  <p class="trip-info__dates">${dates}</p>
</div>`;
};

export default class TripInfoMain extends AbstractView {
  constructor(tripInfoMain) {
    super();
    this._infoMain = tripInfoMain;
  }

  getTemplate() {
    return createTripInfoMainTemplate(this._infoMain);
  }
}

