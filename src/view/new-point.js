import SmartView from "./smart.js";
import dayjs from "dayjs";
import flatpickr from "flatpickr";
import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import {collectOffersTitles} from "../utils/offers.js";

const BLANK_POINT = {
  type: `taxi`,
  destination: {
    name: ``,
    description: ``,
    pictures: []
  },
  offers: [],
  price: 0,
  isFavorite: false,
  startDate: dayjs(),
  endDate: dayjs()
};


const createDestinationList = (destinations) => {
  return `${Object.values(destinations).map((destinationOption) =>
    `<option value="${destinationOption}"></option>`
  ).join(``)}`;
};

const createEventTypeItems = (types, type) => {
  const formatType = (typeToFormat) => typeToFormat.replace(typeToFormat[0], typeToFormat[0].toUpperCase());
  return Object.values(types).map((typeItem) =>
    `<div class="event__type-item">
  <input id="event-type-${typeItem}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeItem}" ${type === `${typeItem}` ? `checked` : ``}>
  <label class="event__type-label  event__type-label--${typeItem}" for="event-type-${typeItem}-1">${formatType(typeItem)}</label>
</div>`).join(``);
};

const createNewPointOffersTemplate = (offers, offersDictionary) => {

  const pointOffersTitles = collectOffersTitles(offers);

  return `${Object.keys(offersDictionary).length !== 0 ?
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${Object.keys(offersDictionary).map(function (typeOffer) {

    return `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${typeOffer}-1" type="checkbox" name="event-offer-${typeOffer}" data-offer-name="${typeOffer}" ${pointOffersTitles.includes(offersDictionary[typeOffer].title) ? `checked` : ``}
     ${offers.includes(typeOffer) ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${typeOffer}-1">
      <span class="event__offer-title">${offersDictionary[typeOffer].title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offersDictionary[typeOffer].price}</span>
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
    return `<img class="event__photo" src=${photo.src} alt="${photo.description}">`;
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

const createNewPointTemplate = (eventItem, destinationDetails, destinationsList, types, offersDictionary) => {

  const {type, destination, offers, price, startDate, endDate} = eventItem;

  let description = ``;
  let photos = [];

  if (destinationDetails) {
    description = destinationDetails.description;
    photos = destinationDetails.pictures;
  }

  const lowerType = type.toLowerCase();
  const formattedStartDate = startDate ? dayjs(startDate).format(`DD/MM/YY HH:mm`) : ``;
  const formattedEndDate = endDate ? dayjs(endDate).format(`DD/MM/YY HH:mm`) : ``;
  const offersTemplate = createNewPointOffersTemplate(offers, offersDictionary[type]);
  const destinationTemplate = createDestinationTemplate(description, photos);
  const eventTypeItems = createEventTypeItems(types, type);
  const destinationOptions = createDestinationList(destinationsList);

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
            ${eventTypeItems}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" autocomplete="off" required>
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
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      ${offersTemplate}
      ${destinationTemplate}
    </section>
  </form>
</li>`;
};

export default class NewPoint extends SmartView {
  constructor(getDestinationDetails, getDestinationsList, getTypes, getOffersDictionary) {
    super();
    this._getDestinationDetails = getDestinationDetails;
    this._getDestinationsList = getDestinationsList;
    this._getTypes = getTypes;
    this._getOffersDictionary = getOffersDictionary;

    this._offersDictionary = this._getOffersDictionary();
    this._point = BLANK_POINT;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);

    this._startDateChangeHandler = this._startDateChangeHandler.bind(this);
    this._endDateChangeHandler = this._endDateChangeHandler.bind(this);
    this._cancelClickHandler = this._cancelClickHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePickers();
  }

  getTemplate() {
    return createNewPointTemplate(this._point, this._getDestinationDetails(this._point.destination.name), this._getDestinationsList(), this._getTypes(), this._offersDictionary);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    this._callback.newPointSubmit(this._point);
  }

  setFormSubmitHandler(callback) {
    this._callback.newPointSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _cancelClickHandler(evt) {
    evt.preventDefault();
    this._callback.newPointCancel();
  }

  setCancelClickHanler(callback) {
    this._callback.newPointCancel = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._cancelClickHandler);
  }

  _eventTypeChangeHandler(evt) {

    if (evt.target.tagName !== `LABEL`) {
      return;
    }

    evt.preventDefault();
    const newEventType = evt.target.textContent;
    this.updatePoint({type: newEventType.toLowerCase(), offers: []});
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const newDestination = evt.target.value;

    if (newDestination) {
      const isExistedDestination = this._getDestinationsList().includes(newDestination);

      if (isExistedDestination) {
        this.updatePoint({destination: {
          name: newDestination,
          description: this._getDestinationDetails(newDestination).description,
          pictures: this._getDestinationDetails(newDestination).pictures
        }});
      } else {
        evt.target.value = ``;
        this.updatePoint({destination: ``});
      }
    }
  }

  _offersChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    const typeOffersDictionary = this._offersDictionary[this._point.type];
    let checkedOffers = this.getElement().querySelectorAll(`input.event__offer-checkbox:checked`);
    checkedOffers = Array.from(checkedOffers).map((checkedOffer) => checkedOffer.dataset.offerName);
    this.updatePoint({offers: checkedOffers.map((offer) => {
      return {
        title: typeOffersDictionary[offer].title,
        price: typeOffersDictionary[offer].price
      };
    })}, true);
  }

  _priceChangeHandler(evt) {
    evt.target.value = evt.target.value.replace(/[^\d]/g, ``);

    const numericalValue = Number(evt.target.value);

    if (numericalValue !== this._point.price) {
      this.updatePoint({price: numericalValue}, true);
    }
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

  _setDatePickers() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(this.getElement().querySelector(`#event-start-time-1`), {
      enableTime: true,
      dateFormat: `d/m/y H:i`,
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

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePickers();
    this.setFormSubmitHandler(this._callback.newPointSubmit);
    this.setCancelClickHanler(this._callback.newPointCancel);
  }
}
