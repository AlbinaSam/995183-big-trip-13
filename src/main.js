import MenuTabsView from "./view/menu-tabs.js";
import StatisticsView from "./view/statistics.js";
import TripContainerView from "./view/trip-container.js";
import {remove, render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import PointsModel from "./model/points.js";
import OffersModel from "./model/offers.js";
import DestinationsModel from "./model/destinations.js";
import FilterModel from "./model/filter.js";
import FilterPresenter from "./presenter/filter.js";
import {MenuItem} from "./const.js";
import Api from "./api.js";
import {UpdateType} from "./const.js";

const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic RTn3AHHAyPuFKk9y`;

const api = new Api(END_POINT, AUTHORIZATION);


const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const pointsModel = new PointsModel();

const filterModel = new FilterModel();

const tripControls = document.querySelector(`.trip-controls`);
const tripControlsHeaders = tripControls.querySelectorAll(`h2`);

const filterPresenter = new FilterPresenter(tripControlsHeaders[1], filterModel);
filterPresenter.init();

const pageMainContainer = document.querySelector(`.page-main .page-body__container`);
const tripContainerComponent = new TripContainerView();
render(pageMainContainer, tripContainerComponent, RenderPosition.ARTERBEGIN);

const tripInfoContainer = document.querySelector(`.trip-main`);
const tripPresenter = new TripPresenter(tripContainerComponent, pointsModel, offersModel, destinationsModel, filterModel, tripInfoContainer, api);
tripPresenter.init();

let menuTabsComponent = new MenuTabsView(MenuItem.TABLE);

let statisticsComponent = new StatisticsView(pointsModel.getPoints());
render(pageMainContainer, statisticsComponent, RenderPosition.BEFOREEND);

const createPointButton = document.querySelector(`.trip-main__event-add-btn`);
createPointButton.setAttribute(`disabled`, `disabled`);

createPointButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (statisticsComponent) {
    statisticsComponent.hide();
    tripPresenter.showTrip();
    menuTabsComponent.updateElement(MenuItem.TABLE);
  }

  tripPresenter.createNewPoint(createPointButton);
  createPointButton.setAttribute(`disabled`, `disabled`);
});

const handleMenuTabs = (menuItem) => {

  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripPresenter.showTrip();
      menuTabsComponent.updateElement(menuItem);
      pageMainContainer.classList.remove(`noafter`);
      break;

    case MenuItem.STATS:
      tripPresenter.hideTrip();
      statisticsComponent.show();
      menuTabsComponent.updateElement(menuItem);
      createPointButton.removeAttribute(`disabled`);
      pageMainContainer.classList.add(`noafter`);
      break;
  }
};

const handleModelEvent = () => {
  remove(statisticsComponent);
  statisticsComponent = null;

  statisticsComponent = new StatisticsView(pointsModel.getPoints());
  render(pageMainContainer, statisticsComponent, RenderPosition.BEFOREEND);
};

pointsModel.addObserver(handleModelEvent);


api.getPoints()
.then((points) => {
  pointsModel.setPoints(UpdateType.INIT, points);
})
.catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
})
.finally(() => {
  render(tripControlsHeaders[0], menuTabsComponent, RenderPosition.AFTEREND);
  menuTabsComponent.setMenuTabChangeHandler(handleMenuTabs);
  createPointButton.removeAttribute(`disabled`);
});
