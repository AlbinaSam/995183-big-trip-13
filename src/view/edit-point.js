import dayjs from "dayjs";
import SmartView from "./smart.js";
import {Types, destinationList} from "../const.js";
import {isNumber} from "../utils/common.js";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const createDestinationList = (destinations) => {
  return `${Object.values(destinations).map((destinationOption) =>
    `<option value="${destinationOption}"></option>`
  ).join(``)}`;
};


const createEditPointOffersTemplate = (typeOffers, offers) => {

  return `${Object.keys(typeOffers).length !== 0 ?
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${Object.keys(typeOffers).map(function (typeOffer) {
    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${typeOffer}-1" type="checkbox" name="event-offer-${typeOffer}" data-offer-name="${typeOffer}" ${offers.includes(typeOffer) ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${typeOffer}-1">
      <span class="event__offer-title">${typeOffers[typeOffer].title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${typeOffers[typeOffer].price}</span>
    </label>
  </div>`;
  }).join(``)}
    </div>
  </section>` : ``}`;
};

const createEditPointPhotosTemplate = (photos) => {
  return `${photos !== undefined && photos.length !== 0 ?
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${photos.map(function (photo) {
    return `<img class="event__photo" src=${photo} alt="Event photo">`;
  }).join(``)}
    </div>
  </div>` : ``}`;
};

const createDestinationTemplate = (description, photos) => {
  return `${description || photos.length !== 0 ?
    `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  ${description ?
    `<p class="event__destination-description">${description}</p>` : ``}
  ${photos.length !== 0 ?
    `${createEditPointPhotosTemplate(photos)}` : ``}
</section>` : ``}`;
};

const createEventTypeItem = (type) => {
  return Object.values(Types).map((typeItem) =>
    `<div class="event__type-item">
  <input id="event-type-${typeItem.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeItem.toLowerCase()}" ${type === `${typeItem}` ? `checked` : ``}>
  <label class="event__type-label  event__type-label--${typeItem.toLowerCase()}" for="event-type-${typeItem.toLowerCase()}-1">${typeItem}</label>
</div>`).join(``);
};

const createEditPointTemplate = (eventItem, typeOffers, destinationDetails) => {

  const {type, destination, offers, price, startDate, endDate} = eventItem;
  const {description, photos} = destinationDetails;
  const lowerType = type.toLowerCase();
  const formattedStartDate = dayjs(startDate).format(`DD/MM/YY HH:mm`);
  const formattedEndDate = dayjs(endDate).format(`DD/MM/YY HH:mm`);
  const offersTemplate = createEditPointOffersTemplate(typeOffers, offers);
  const destinationTemplate = createDestinationTemplate(description, photos);
  const eventTypeItem = createEventTypeItem(type);
  const destinationOptions = createDestinationList(destinationList);

  return `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${lowerType}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            ${eventTypeItem}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1" autocomplete="off">
        <datalist id="destination-list-1">
        ${destinationOptions}
        </datalist>
      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formattedStartDate}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formattedEndDate}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>
    <section class="event__details">
      ${offersTemplate}
      ${destinationTemplate}
    </section>
  </form>
</li>`;
};

export default class EditPoint extends SmartView {
  constructor(sortedRoutePoint, typeOffersModel, destinationDetailsModel) {
    super();
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._point = sortedRoutePoint;
    this._typeOffersModel = typeOffersModel;
    this._destinationDetailsModel = destinationDetailsModel;
    this._originalPoint = sortedRoutePoint;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._editPointClickHandler = this._editPointClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._pointDeleteClickHandler = this._pointDeleteClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePickers();
  }

  getTemplate() {
    return createEditPointTemplate(this._point, this._typeOffersModel.getOffers(this._point.type), this._destinationDetailsModel.getDestinationDetails(this._point.destination));
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._point);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _editPointClickHandler(evt) {
    evt.preventDefault();
    this._callback.editPointClick();
  }

  setEditPointClickHandler(callback) {
    this._callback.editPointClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editPointClickHandler);
  }

  _eventTypeChangeHandler(evt) {

    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    evt.preventDefault();
    const newEventType = evt.target.textContent;
    this.updatePoint({type: newEventType, offers: []});
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const newDestination = evt.target.value;

    const isExistedDestination = Object.values(destinationList).includes(newDestination);
    if (newDestination && isExistedDestination) {
      this.updatePoint({destination: newDestination});
    }
  }

  _offersChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    let checkedOffers = this.getElement().querySelectorAll(`input.event__offer-checkbox:checked`);
    checkedOffers = Array.from(checkedOffers).map((checkedOffer) => checkedOffer.dataset.offerName);
    this.updatePoint({offers: checkedOffers}, true);
  }

  _priceChangeHandler(evt) {

    const numericalValue = Number(evt.target.value);

    if (isNumber(numericalValue) && Number.isInteger(numericalValue)) {
      this.updatePoint({price: evt.target.value}, true);
    } else {
      evt.target.value = evt.target.value.replace(/[^\d]/g, ``);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditPointClickHandler(this._callback.editPointClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`click`, this._eventTypeChangeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`change`, this._destinationChangeHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._priceChangeHandler);
    const offers = this.getElement().querySelector(`.event__available-offers`);
    if (offers) {
      offers.addEventListener(`change`, this._offersChangeHandler);
    }
  }

  reset() {
    this.updatePoint(this._originalPoint);
  }

  removeElement() {
    super.removeElement();

    if (this._startDatepicker || this._endDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }
  }

  _setDatePickers() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(this.getElement().querySelector(`#event-start-time-1`), {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      minDate: `today`,
      onChange: this._startDateChangeHandler
    });


    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(this.getElement().querySelector(`#event-end-time-1`), {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
      minDate: this.getElement().querySelector(`#event-start-time-1`).value,
      onChange: this._endDateChangeHandler
    });
  }

  _startDateChangeHandler(userdate) {
    this.updatePoint({startDate: dayjs(userdate)});
  }

  _endDateChangeHandler(userdate) {
    this.updatePoint({endDate: dayjs(userdate)});
  }

  _pointDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._point);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._pointDeleteClickHandler);
  }
}

