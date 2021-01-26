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
import Api from "./api/api.js";
import {MenuItem, UpdateType} from "./const.js";
import {isOnline} from "./utils/common.js";
import {toast} from "./utils/toast/toast.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";

const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic RTn3AHHAyPuFKk9y`;

const POINTS_STORE_PREFIX = `bigtrip-points-localstorage`;
const OFFERS_STORE_PREFIX = `bigtrip-offers-localstorage`;
const DESTINATIONS_STORE_PREFIX = `bigtrip-destinations-localstorage`;
const STORE_VER = `v13`;

const POINTS_STORE_NAME = {POINTS_STORE_KEY: `${POINTS_STORE_PREFIX}-${STORE_VER}`};
const OFFERS_STORE_NAME = {OFFERS_STORE_KEY: `${OFFERS_STORE_PREFIX}-${STORE_VER}`};
const DESTINATIONS_STORE_NAME = {DESTINATIONS_STORE_KEY: `${DESTINATIONS_STORE_PREFIX}-${STORE_VER}`};

const api = new Api(END_POINT, AUTHORIZATION);

const store = new Store(POINTS_STORE_NAME, OFFERS_STORE_NAME, DESTINATIONS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const pointsModel = new PointsModel();

const filterModel = new FilterModel();

const tripControls = document.querySelector(`.trip-controls`);
const tripControlsHeaders = tripControls.querySelectorAll(`h2`);

const filterPresenter = new FilterPresenter(tripControlsHeaders[1], filterModel, pointsModel);

const pageMainContainer = document.querySelector(`.page-main .page-body__container`);
const tripContainerComponent = new TripContainerView();
render(pageMainContainer, tripContainerComponent, RenderPosition.ARTERBEGIN);

const tripInfoContainer = document.querySelector(`.trip-main`);
const tripPresenter = new TripPresenter(tripContainerComponent, pointsModel, offersModel, destinationsModel, filterModel, tripInfoContainer, apiWithProvider);
tripPresenter.init();

const menuTabsComponent = new MenuTabsView(MenuItem.TABLE);

let statisticsComponent = new StatisticsView(pointsModel.getPoints());
render(pageMainContainer, statisticsComponent, RenderPosition.BEFOREEND);

const createPointButton = document.querySelector(`.trip-main__event-add-btn`);
createPointButton.setAttribute(`disabled`, `disabled`);

createPointButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();

  if (!isOnline()) {
    toast(`You can't create new event offline`);
    return;
  }

  statisticsComponent.hide();
  tripPresenter.showTrip();
  menuTabsComponent.updateElement(MenuItem.TABLE);

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

  filterPresenter.init();
};

pointsModel.addObserver(handleModelEvent);


Promise.all([
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations(),
  apiWithProvider.getPoints()
])
.then(([offers, destinations, points]) => {
  offersModel.setTypeOffers(offers);
  destinationsModel.setDestinationDetails(destinations);
  pointsModel.setPoints(UpdateType.INIT, points);
})
.catch(() => {
  offersModel.setTypeOffers([]);
  destinationsModel.setDestinationDetails([]);
  pointsModel.setPoints(UpdateType.INIT, []);
})
.finally(() => {
  render(tripControlsHeaders[0], menuTabsComponent, RenderPosition.AFTEREND);
  menuTabsComponent.setMenuTabChangeHandler(handleMenuTabs);
  createPointButton.removeAttribute(`disabled`);
});


window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (apiWithProvider.getSyncNeed()) {
    apiWithProvider.sync();
  }

});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
