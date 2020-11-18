import {createTripInfoTemplate} from "./view/trip-info";
import {createTripInfoMainTemplate} from "./view/trip-info-main";
import {createTripInfoCost} from "./view/trip-info-cost";
import {createMenuTabsTemplate} from "./view/menu-tabs.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createEventListTemplate} from "./view/event-list.js";
import {createEditPointTemplate} from "./view/edit-point.js";
import {createNewPointTemplate} from "./view/new-point.js";
import {createEventTemplate} from "./view/event.js";

const EVENT_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfoContainer = document.querySelector(`.trip-main`);
render(tripInfoContainer, createTripInfoTemplate(), `afterbegin`);
const tripInfo = document.querySelector(`.trip-info`);
render(tripInfo, createTripInfoMainTemplate(), `afterbegin`);
render(tripInfo, createTripInfoCost(), `beforeEnd`);

const tripControls = document.querySelector(`.trip-controls`);
const tripControlsHeaders = tripControls.querySelectorAll(`h2`);
render(tripControlsHeaders[0], createMenuTabsTemplate(), `afterend`);
render(tripControlsHeaders[1], createFilterTemplate(), `afterend`);

const tripEvents = document.querySelector(`.trip-events`);
const tripEventsHeader = tripEvents.querySelector(`h2`);
render(tripEventsHeader, createSortingTemplate(), `afterend`);

render(tripEvents, createEventListTemplate(), `beforeEnd`);
const eventsList = document.querySelector(`.trip-events__list`);


render(eventsList, createEditPointTemplate(), `afterbegin`);

for (let i = 0; i < EVENT_COUNT; i++) {
  render(eventsList, createEventTemplate(), `beforeend`);
}
