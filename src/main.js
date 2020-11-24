import {createTripInfoTemplate} from "./view/trip-info";
import {createTripInfoMainTemplate} from "./view/trip-info-main";
import {createTripInfoCostTemplate} from "./view/trip-info-cost";
import {createMenuTabsTemplate} from "./view/menu-tabs.js";
import {createFilterTemplate} from "./view/filter.js";
import {createSortingTemplate} from "./view/sorting.js";
import {createEventListTemplate} from "./view/event-list.js";
import {createEditPointTemplate} from "./view/edit-point.js";
import {createNewPointTemplate} from "./view/new-point.js";
import {createPointTemplate} from "./view/point.js";
import {generatePoint} from "./mock/point.js";
import {generateTripInfoMain} from "./mock/trip-info.js";

const POINTS_COUNT = 20;

const routePoints = new Array(POINTS_COUNT).fill().map(generatePoint);

const sortPointsByStartDate = (pointsArr) => {

  pointsArr.sort(function (a, b) {
    if (a.startDate > b.startDate) {
      return 1;
    }
    if (a.startDate === b.startDate) {
      return 0;
    }
    if (a.startDate < b.startDate) {
      return -1;
    }
    return pointsArr;
  });
  return pointsArr;
};

const sortedRoutePoints = sortPointsByStartDate(routePoints);

const tripInfoMain = generateTripInfoMain(sortedRoutePoints);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripInfoContainer = document.querySelector(`.trip-main`);
render(tripInfoContainer, createTripInfoTemplate(), `afterbegin`);
const tripInfo = document.querySelector(`.trip-info`);
render(tripInfo, createTripInfoMainTemplate(tripInfoMain), `afterbegin`);
render(tripInfo, createTripInfoCostTemplate(), `beforeEnd`);

const tripControls = document.querySelector(`.trip-controls`);
const tripControlsHeaders = tripControls.querySelectorAll(`h2`);
render(tripControlsHeaders[0], createMenuTabsTemplate(), `afterend`);
render(tripControlsHeaders[1], createFilterTemplate(), `afterend`);

const tripEvents = document.querySelector(`.trip-events`);
const tripEventsHeader = tripEvents.querySelector(`h2`);
render(tripEventsHeader, createSortingTemplate(), `afterend`);

render(tripEvents, createEventListTemplate(), `beforeEnd`);
const pointsList = document.querySelector(`.trip-events__list`);

// render(pointsList, createNewPointTemplate(), `afterbegin`);
render(pointsList, createEditPointTemplate(sortedRoutePoints[0]), `afterbegin`);

for (let i = 1; i < POINTS_COUNT; i++) {
  render(pointsList, createPointTemplate(sortedRoutePoints[i]), `beforeend`);
}
