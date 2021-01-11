import MenuTabsView from "./view/menu-tabs.js";
import StatisticsView from "./view/statistics.js";
import {generatePoint} from "./mock/point.js";
import {remove, render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";
import {MenuItem} from "./const.js";

const POINTS_COUNT = 20;
const tripPoints = new Array(POINTS_COUNT).fill().map(generatePoint);

const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const pointsModel = new PointsModel();
pointsModel.setPoints(tripPoints);

const filterModel = new FilterModel();

const tripControls = document.querySelector(`.trip-controls`);
const tripControlsHeaders = tripControls.querySelectorAll(`h2`);


let menuTabsComponent = new MenuTabsView(MenuItem.TABLE);
render(tripControlsHeaders[0], menuTabsComponent, RenderPosition.AFTEREND);

const filterPresenter = new FilterPresenter(tripControlsHeaders[1], filterModel);
filterPresenter.init();


const tripPointsContainer = document.querySelector(`.trip-events`);
const tripInfoContainer = document.querySelector(`.trip-main`);
const tripPresenter = new TripPresenter(tripPointsContainer, pointsModel, offersModel, destinationsModel, filterModel, tripInfoContainer);
tripPresenter.init();

let statisticsComponent = null;

const tabs = menuTabsComponent.getElement().querySelectorAll(`.trip-tabs__btn`);
const createPointButton = document.querySelector(`.trip-main__event-add-btn`);

createPointButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (statisticsComponent) {
    statisticsComponent.hide();
    remove(statisticsComponent);
    statisticsComponent = null;
    tripPresenter.showTrip();
    tabs.forEach((tab) => tab.classList.toggle(`trip-tabs__btn--active`));
    menuTabsComponent.changeCurrentTab(MenuItem.TABLE);
  }

  tripPresenter.createNewPoint(createPointButton);
  createPointButton.setAttribute(`disabled`, `disabled`);
});

const handleMenuTabs = (menuItem) => {

  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      remove(statisticsComponent);
      statisticsComponent = null;
      tripPresenter.showTrip();
      tabs.forEach((tab) => tab.classList.toggle(`trip-tabs__btn--active`));
      break;

    case MenuItem.STATS:
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(tripPointsContainer, statisticsComponent, RenderPosition.AFTEREND);
      tripPresenter.hideTrip();
      statisticsComponent.show();
      tabs.forEach((tab) => tab.classList.toggle(`trip-tabs__btn--active`));
      createPointButton.removeAttribute(`disabled`);
      break;
  }
};

menuTabsComponent.setMenuTabChangeHandler(handleMenuTabs);
