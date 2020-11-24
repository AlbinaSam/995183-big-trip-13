import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const createPointOffersTemplate = (offers) => {
  return `${offers !== undefined ? `<ul class="event__selected-offers">
    ${offers.map(function ({title, price}) {
    return `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`;
  }).join(``)}
  </ul>` : ``}`;
};

const getDuration = (startDate, endDate) => {
  const datesDiff = dayjs.duration(endDate.diff(startDate));

  const days = datesDiff.days();
  const hours = datesDiff.hours();
  const minutes = datesDiff.minutes();
  let pointDuration = ``;

  if (days !== 0) {
    if (days.toString().length === 1) {
      pointDuration = `0` + days + `D `;
    } else {
      pointDuration = days + `D `;
    }
    if (hours.toString().length === 1) {
      pointDuration = pointDuration + `0` + hours + `H `;
    } else {
      pointDuration = pointDuration + hours + `H `;
    }
    if (minutes.toString().length === 1) {
      pointDuration = pointDuration + `0` + minutes + `M`;
    } else {
      pointDuration = pointDuration + minutes + `M`;
    }
    return pointDuration;
  }

  if (hours !== 0) {
    if (hours.toString().length === 1) {
      pointDuration = pointDuration + `0` + hours + `H `;
    } else {
      pointDuration = pointDuration + hours + `H `;
    }
    if (minutes.toString().length === 1) {
      pointDuration = pointDuration + `0` + minutes + `M`;
    } else {
      pointDuration = pointDuration + minutes + `M`;
    }
  } else {
    if (minutes.toString().length === 1) {
      pointDuration = pointDuration + `0` + minutes + `M`;
    } else {
      pointDuration = pointDuration + minutes + `M`;
    }
  }
  return pointDuration;
};


export const createPointTemplate = (eventItem) => {
  const {type, destination, offers, price, isFavorite, startDate, endDate} = eventItem;

  const formattedStartDate = dayjs(startDate).format(`DD/MM/YY HH:mm`);
  const formattedEndDate = dayjs(endDate).format(`DD/MM/YY HH:mm`);

  const formattedStartDateTimeAttr = dayjs(startDate).format(`YYYY-MM-DDTHH:mm`);
  const formattedEndDateTimeAttr = dayjs(endDate).format(`YYYY-MM-DDTHH:mm`);

  const pointDuration = getDuration(startDate, endDate);

  const day = dayjs(startDate).format(`DD MMM`);

  const favoriteClassName = isFavorite
    ? `event__favorite-btn--active`
    : ``;

  const offersTemplate = createPointOffersTemplate(offers);
  return `<li class="trip-events__item">
  <div class="event">
    <time class="event__date" datetime="2019-03-18">${day}</time>
    <div class="event__type">
      <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
    </div>
    <h3 class="event__title">${type} ${destination}</h3>
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${formattedStartDateTimeAttr}">${formattedStartDate}</time>
        &mdash;
        <time class="event__end-time" datetime="${formattedEndDateTimeAttr}">${formattedEndDate}</time>
      </p>
      <p class="event__duration">${pointDuration}</p>
    </div>
    <p class="event__price">
      &euro;&nbsp;<span class="event__price-value">${price}</span>
    </p>
    <h4 class="visually-hidden">Offers:</h4>
    ${offersTemplate}
    <button class="event__favorite-btn ${favoriteClassName}" type="button">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </div>
</li>`;
};
