import TripInfoView from "./view/trip-info.js";
import TripInfoMainView from "./view/trip-info-main.js";
import TripInfoCostView from "./view/trip-info-cost.js";
import MenuTabsView from "./view/menu-tabs.js";
import FilterView from "./view/filter.js";
import SortingView from "./view/sorting.js";
import PointListView from "./view/point-list.js";
import EditPointView from "./view/edit-point.js";
import NewPointView from "./view/new-point.js";
import PointView from "./view/point.js";
import NoPointView from "./view/no-point.js";
import {generatePoint} from "./mock/point.js";
import {generateTripInfoMain} from "./mock/trip-info-main.js";
import {renderElement, RenderPosition} from "./util.js";

const POINTS_COUNT = 20;

const routePoints = new Array(POINTS_COUNT).fill().map(generatePoint);
const tripPointsContainer = document.querySelector(`.trip-events`);
const tripPointsHeader = tripPointsContainer.querySelector(`h2`);

if (routePoints.length === 0) {
  renderElement(tripPointsHeader, new NoPointView().getElement(), RenderPosition.AFTEREND);
} else {

  const sortPointsByStartDate = (pointsArr) => pointsArr.sort((a, b) => a.startDate - b.startDate);

  const sortedRoutePoints = sortPointsByStartDate(routePoints);

  const tripInfoMain = generateTripInfoMain(sortedRoutePoints);

  const tripInfoContainer = document.querySelector(`.trip-main`);

  const pointListElement = new PointListView().getElement();

  const renderTripInfo = () => {
    const tripInfoComponent = new TripInfoView();
    renderElement(tripInfoContainer, tripInfoComponent.getElement(), RenderPosition.ARTERBEGIN);

    renderElement(tripInfoComponent.getElement(), new TripInfoMainView(tripInfoMain).getElement(), RenderPosition.ARTERBEGIN);
    renderElement(tripInfoComponent.getElement(), new TripInfoCostView().getElement(), RenderPosition.BEFOREEND);

    const tripControls = document.querySelector(`.trip-controls`);
    const tripControlsHeaders = tripControls.querySelectorAll(`h2`);
    renderElement(tripControlsHeaders[0], new MenuTabsView().getElement(), RenderPosition.AFTEREND);
    renderElement(tripControlsHeaders[1], new FilterView().getElement(), RenderPosition.AFTEREND);

    renderElement(tripPointsHeader, new SortingView().getElement(), RenderPosition.AFTEREND);

    renderElement(tripPointsContainer, pointListElement, RenderPosition.BEFOREEND);
  };

  renderTripInfo();

  const renderTask = (point) => {
    const pointComponent = new PointView(point);
    const editPointComponent = new EditPointView(point);

    const onEscKeyDown = (evt) => {
      if (evt.key === `Escape` || evt.key === `Esc`) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    const replacePointToForm = () => {
      pointListElement.replaceChild(editPointComponent.getElement(), pointComponent.getElement());
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const replaceFormToPoint = () => {
      pointListElement.replaceChild(pointComponent.getElement(), editPointComponent.getElement());
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    pointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      replacePointToForm();

    });

    editPointComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
      evt.preventDefault();
      replaceFormToPoint();
    });

    editPointComponent.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, () => {
      replaceFormToPoint();
    });

    renderElement(pointListElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
  };

  for (let i = 0; i < POINTS_COUNT; i++) {
    renderTask(sortedRoutePoints[i]);
  }
}
