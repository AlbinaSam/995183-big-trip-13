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
import {render, RenderPosition, replace, remove} from "./utils/render.js";

const POINTS_COUNT = 20;

const routePoints = new Array(POINTS_COUNT).fill().map(generatePoint);
const tripPointsContainer = document.querySelector(`.trip-events`);
const tripPointsHeader = tripPointsContainer.querySelector(`h2`);

if (routePoints.length === 0) {
  render(tripPointsHeader, new NoPointView(), RenderPosition.AFTEREND);
} else {

  const sortPointsByStartDate = (pointsArr) => pointsArr.sort((a, b) => a.startDate - b.startDate);

  const sortedRoutePoints = sortPointsByStartDate(routePoints);

  const tripInfoMain = generateTripInfoMain(sortedRoutePoints);

  const tripInfoContainer = document.querySelector(`.trip-main`);

  const pointListComponent = new PointListView();

  const renderTripInfo = () => {
    const tripInfoComponent = new TripInfoView();
    render(tripInfoContainer, tripInfoComponent, RenderPosition.ARTERBEGIN);

    render(tripInfoComponent, new TripInfoMainView(tripInfoMain), RenderPosition.ARTERBEGIN);
    render(tripInfoComponent, new TripInfoCostView(), RenderPosition.BEFOREEND);

    const tripControls = document.querySelector(`.trip-controls`);
    const tripControlsHeaders = tripControls.querySelectorAll(`h2`);
    render(tripControlsHeaders[0], new MenuTabsView(), RenderPosition.AFTEREND);
    render(tripControlsHeaders[1], new FilterView(), RenderPosition.AFTEREND);

    render(tripPointsHeader, new SortingView(), RenderPosition.AFTEREND);

    render(tripPointsContainer, pointListComponent, RenderPosition.BEFOREEND);
  };

  renderTripInfo();

  const renderPoint = (point) => {
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
      replace(editPointComponent, pointComponent);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, editPointComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    pointComponent.setPointClickHandler(() => {
      replacePointToForm();
    });

    editPointComponent.setFormSubmitHandler(() => {
      replaceFormToPoint();
    });

    editPointComponent.setEditPointClickHandler(() => {
      replaceFormToPoint();
    });

    render(pointListComponent, pointComponent, RenderPosition.BEFOREEND);
  };

  for (let i = 0; i < POINTS_COUNT; i++) {
    renderPoint(sortedRoutePoints[i]);
  }
}
