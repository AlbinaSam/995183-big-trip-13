import MenuTabsView from "./view/menu-tabs.js";
import {generatePoint} from "./mock/point.js";
import {render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";

const POINTS_COUNT = 20;
const tripPoints = new Array(POINTS_COUNT).fill().map(generatePoint);

const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const pointsModel = new PointsModel();
pointsModel.setPoints(tripPoints);

const filterModel = new FilterModel();

const tripControls = document.querySelector(`.trip-controls`);
const tripControlsHeaders = tripControls.querySelectorAll(`h2`);
render(tripControlsHeaders[0], new MenuTabsView(), RenderPosition.AFTEREND);

const filterPresenter = new FilterPresenter(tripControlsHeaders[1], filterModel);
filterPresenter.init();


const tripPointsContainer = document.querySelector(`.trip-events`);
const tripInfoContainer = document.querySelector(`.trip-main`);
const tripPresenter = new TripPresenter(tripPointsContainer, pointsModel, offersModel, destinationsModel, filterModel, tripInfoContainer);
tripPresenter.init();

const createPointButton = document.querySelector(`.trip-main__event-add-btn`);

createPointButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createNewPoint(createPointButton);
  createPointButton.setAttribute(`disabled`, `disabled`);
});

