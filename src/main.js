import TripInfoView from "./view/trip-info.js";
import TripInfoMainView from "./view/trip-info-main.js";
import TripInfoCostView from "./view/trip-info-cost.js";
import MenuTabsView from "./view/menu-tabs.js";
import FilterView from "./view/filter.js";
import {generatePoint} from "./mock/point.js";
import {generateTripInfoMain} from "./mock/trip-info-main.js";
import {render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";

const POINTS_COUNT = 20;

const tripPoints = new Array(POINTS_COUNT).fill().map(generatePoint);

const tripPointsContainer = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(tripPointsContainer);

const sortPointsByStartDate = (pointsArr) => pointsArr.sort((a, b) => a.startDate - b.startDate);

const sortedTripPoints = sortPointsByStartDate(tripPoints);

const tripInfoMain = generateTripInfoMain(sortedTripPoints);


const tripInfoContainer = document.querySelector(`.trip-main`);
const renderTripInfo = () => {
  const tripInfoComponent = new TripInfoView();
  render(tripInfoContainer, tripInfoComponent, RenderPosition.ARTERBEGIN);

  render(tripInfoComponent, new TripInfoMainView(tripInfoMain), RenderPosition.ARTERBEGIN);
  render(tripInfoComponent, new TripInfoCostView(), RenderPosition.BEFOREEND);

  const tripControls = document.querySelector(`.trip-controls`);
  const tripControlsHeaders = tripControls.querySelectorAll(`h2`);
  render(tripControlsHeaders[0], new MenuTabsView(), RenderPosition.AFTEREND);
  render(tripControlsHeaders[1], new FilterView(), RenderPosition.AFTEREND);
};
renderTripInfo();

tripPresenter.init(sortedTripPoints);
