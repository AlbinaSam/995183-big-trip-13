import AbstractView from "./abstract.js";
import {filter} from "../utils/filter.js";

const createFilterTemplate = (filterTypes, currentFilter, points) => {
  return `<form class="trip-filters" action="#" method="get">
  ${Object.values(filterTypes).map(function (filterType) {
    return `<div class="trip-filters__filter">
    <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType}" ${filterType === currentFilter ? `checked` : ``} ${filter[filterType](points).length === 0 ? `disabled` : ``}>
    <label class="trip-filters__filter-label" for="filter-${filterType}">${filterType.toLowerCase()}</label>
  </div>`;
  }).join(``)}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;
};


export default class Filter extends AbstractView {
  constructor(filters, currentFilter, getPoints) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;
    this._getPoints = getPoints;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilter, this._getPoints());
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}
