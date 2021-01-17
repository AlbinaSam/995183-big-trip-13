import AbstractView from "./abstract.js";

const createTripInfoCostTemplate = (tripCost) => {
  return `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${tripCost}</span>
</p>`;
};

export default class TripInfoCost extends AbstractView {

  constructor(tripCost) {
    super();
    this._tripCost = tripCost;
  }

  getTemplate() {
    return createTripInfoCostTemplate(this._tripCost);
  }
}
