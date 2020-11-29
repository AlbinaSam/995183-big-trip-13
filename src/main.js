import TripInfoView from "./view/trip-info.js";
import TripInfoMainView from "./view/trip-info-main.js";
import TripInfoCostView from "./view/trip-info-cost.js";
import MenuTabsView from "./view/menu-tabs.js";
import FilterView from "./view/filter.js";
import SortingView from "./view/sorting.js";
import EventListView from "./view/event-list.js";
import EditPointView from "./view/edit-point.js";
import NewPointView from "./view/new-point.js";
import PointView from "./view/point.js";
import {generatePoint} from "./mock/point.js";
import {generateTripInfoMain} from "./mock/trip-info-main.js";
import {renderElement, RenderPosition} from "./util.js";

const POINTS_COUNT = 20;

const routePoints = new Array(POINTS_COUNT).fill().map(generatePoint);

const sortPointsByStartDate = (pointsArr) => pointsArr.sort((a, b) => a.startDate - b.startDate);

const sortedRoutePoints = sortPointsByStartDate(routePoints);

const tripInfoMain = generateTripInfoMain(sortedRoutePoints);

const tripInfoComponent = new TripInfoView();
const tripInfoContainer = document.querySelector(`.trip-main`);
renderElement(tripInfoContainer, tripInfoComponent.getElement(), RenderPosition.ARTERBEGIN);

renderElement(tripInfoComponent.getElement(), new TripInfoMainView(tripInfoMain).getElement(), RenderPosition.ARTERBEGIN);
renderElement(tripInfoComponent.getElement(), new TripInfoCostView().getElement(), RenderPosition.BEFOREEND);

const tripControls = document.querySelector(`.trip-controls`);
const tripControlsHeaders = tripControls.querySelectorAll(`h2`);
renderElement(tripControlsHeaders[0], new MenuTabsView().getElement(), RenderPosition.AFTEREND);
renderElement(tripControlsHeaders[1], new FilterView().getElement(), RenderPosition.AFTEREND);

const tripEvents = document.querySelector(`.trip-events`);
const tripEventsHeader = tripEvents.querySelector(`h2`);
renderElement(tripEventsHeader, new SortingView().getElement(), RenderPosition.AFTEREND);

const eventListComponent = new EventListView();
renderElement(tripEvents, eventListComponent.getElement(), RenderPosition.BEFOREEND);
const pointsList = eventListComponent.getElement();


const renderTask = (pointsListElement, point) => {
  const pointComponent = new PointView(point);
  const editPointComponent = new EditPointView(point);

  const replacePointToForm = () => {
    pointsListElement.replaceChild(editPointComponent.getElement(), pointComponent.getElement());
  };

  const replaceFormToPoint = () => {
    pointsListElement.replaceChild(pointComponent.getElement(), editPointComponent.getElement());
  };

  pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replacePointToForm();
  });

  editPointComponent.getElement().querySelector(`form`).addEventListener(`submit`, () => {
    replaceFormToPoint();
  });

  editPointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
    replaceFormToPoint();
  });

  renderElement(pointsListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

for (let i = 0; i < POINTS_COUNT; i++) {
  renderTask(pointsList, sortedRoutePoints[i]);
}
